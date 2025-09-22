const express = require('express');
const Simulation = require('../models/Simulation');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');
const { validateSimulation } = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/simulation/run
// @desc    Run delivery simulation
// @access  Private
router.post('/run', validateSimulation, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { drivers: numDrivers, startTime: shiftStart, maxHours, routeOptimization = true, fuelEfficiency = 85, weatherCondition = 'normal' } = req.body;

    // Get available drivers
    const availableDrivers = await Driver.find({ status: 'Active' }).limit(numDrivers);
    
    if (availableDrivers.length < numDrivers) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${availableDrivers.length} drivers available, but ${numDrivers} requested`,
        code: 'INSUFFICIENT_DRIVERS'
      });
    }

    // Get all routes and orders
    const routes = await Route.find();
    const orders = await Order.find();

    if (routes.length === 0 || orders.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No routes or orders available for simulation',
        code: 'NO_DATA_AVAILABLE'
      });
    }

    // Run simulation logic
    const simulationResults = await runSimulationLogic({
      drivers: availableDrivers,
      routes,
      orders,
      numDrivers,
      shiftStart,
      maxHours,
      routeOptimization,
      fuelEfficiency,
      weatherCondition
    });

    // Save simulation to database
    const simulation = new Simulation({
      userId: req.user._id,
      parameters: {
        drivers: numDrivers,
        startTime: shiftStart,
        maxHours,
        routeOptimization,
        fuelEfficiency,
        weatherCondition
      },
      results: simulationResults,
      executionTime: Date.now() - startTime,
      status: 'completed'
    });

    await simulation.save();

    res.status(200).json({
      status: 'success',
      message: 'Simulation completed successfully',
      data: {
        simulationId: simulation._id,
        results: simulationResults,
        executionTime: Date.now() - startTime
      }
    });

  } catch (error) {
    console.error('Simulation error:', error);
    
    // Save failed simulation
    try {
      const failedSimulation = new Simulation({
        userId: req.user._id,
        parameters: req.body,
        results: {
          totalProfit: 0,
          efficiencyScore: 0,
          onTimeDeliveries: 0,
          lateDeliveries: 100,
          totalFuelCost: 0,
          avgDeliveryTime: 0,
          totalOrders: 0
        },
        executionTime: Date.now() - startTime,
        status: 'failed'
      });
      await failedSimulation.save();
    } catch (saveError) {
      console.error('Failed to save failed simulation:', saveError);
    }

    res.status(500).json({
      status: 'error',
      message: 'Simulation failed',
      code: 'SIMULATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/simulation/history
// @desc    Get simulation history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user._id };
    if (status) query.status = status;

    const simulations = await Simulation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userId');

    const total = await Simulation.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        simulations,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get simulation history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch simulation history',
      code: 'FETCH_HISTORY_ERROR'
    });
  }
});

// @route   GET /api/simulation/:id
// @desc    Get specific simulation
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const simulation = await Simulation.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('-userId');

    if (!simulation) {
      return res.status(404).json({
        status: 'error',
        message: 'Simulation not found',
        code: 'SIMULATION_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { simulation }
    });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch simulation',
      code: 'FETCH_SIMULATION_ERROR'
    });
  }
});

// Simulation Logic Function
async function runSimulationLogic({ drivers, routes, orders, numDrivers, shiftStart, maxHours, routeOptimization, fuelEfficiency, weatherCondition }) {
  // Create route lookup map
  const routeMap = {};
  routes.forEach(route => {
    routeMap[route.routeId] = route;
  });

  // Weather impact on delivery times
  const weatherMultiplier = {
    excellent: 0.9,
    normal: 1.0,
    poor: 1.2,
    severe: 1.5
  };

  const weatherImpact = weatherMultiplier[weatherCondition] || 1.0;
  
  // Fuel efficiency impact
  const fuelMultiplier = fuelEfficiency / 100;

  let totalProfit = 0;
  let totalFuelCost = 0;
  let totalPenalties = 0;
  let totalBonuses = 0;
  let onTimeCount = 0;
  let lateCount = 0;
  let totalDeliveryTime = 0;

  // Simulate order processing
  for (const order of orders) {
    const route = routeMap[order.routeId];
    if (!route) continue;

    // Apply company rules
    
    // 1. Calculate base delivery time with weather impact
    const baseDeliveryTime = route.baseTimeMin * weatherImpact;
    const actualDeliveryTime = order.deliveryTimeMinutes;
    
    // 2. Check if delivery is on time (base time + 10 minutes grace period)
    const isOnTime = actualDeliveryTime <= (baseDeliveryTime + 10);
    
    if (isOnTime) {
      onTimeCount++;
    } else {
      lateCount++;
      // Late delivery penalty: ₹50
      totalPenalties += 50;
    }

    // 3. High-value bonus: If order value > ₹1000 AND delivered on time → add 10% bonus
    let bonus = 0;
    if (order.valueRs > 1000 && isOnTime) {
      bonus = order.valueRs * 0.1;
      totalBonuses += bonus;
    }

    // 4. Fuel cost calculation with efficiency
    const baseFuelCost = route.distanceKm * 5; // ₹5/km base cost
    const trafficSurcharge = route.trafficLevel === 'High' ? route.distanceKm * 2 : 0; // +₹2/km for high traffic
    const fuelCost = (baseFuelCost + trafficSurcharge) / fuelMultiplier;
    totalFuelCost += fuelCost;

    // 5. Calculate profit for this order
    const orderProfit = order.valueRs + bonus - (isOnTime ? 0 : 50) - fuelCost;
    totalProfit += orderProfit;
    
    totalDeliveryTime += actualDeliveryTime;
  }

  // Apply driver fatigue rule
  // If a driver worked >8 hours yesterday, delivery speed decreases by 30%
  let fatigueImpact = 0;
  drivers.forEach(driver => {
    if (driver.isFatigued()) {
      fatigueImpact += 0.3; // 30% speed decrease
    }
  });

  // Adjust delivery times for fatigue
  if (fatigueImpact > 0) {
    const fatigueMultiplier = 1 + (fatigueImpact / drivers.length);
    totalDeliveryTime *= fatigueMultiplier;
  }

  // Calculate final metrics
  const totalOrders = orders.length;
  const avgDeliveryTime = totalOrders > 0 ? totalDeliveryTime / totalOrders : 0;
  const onTimePercentage = totalOrders > 0 ? (onTimeCount / totalOrders) * 100 : 0;
  const latePercentage = totalOrders > 0 ? (lateCount / totalOrders) * 100 : 0;
  
  // Efficiency Score: (OnTime Deliveries / Total Deliveries) × 100
  const efficiencyScore = onTimePercentage;

  return {
    totalProfit: Math.round(totalProfit),
    efficiencyScore: Math.round(efficiencyScore * 10) / 10,
    onTimeDeliveries: Math.round(onTimePercentage),
    lateDeliveries: Math.round(latePercentage),
    totalFuelCost: Math.round(totalFuelCost),
    avgDeliveryTime: Math.round(avgDeliveryTime),
    totalOrders,
    totalPenalties: Math.round(totalPenalties),
    totalBonuses: Math.round(totalBonuses)
  };
}

module.exports = router;