const express = require('express');
const Route = require('../models/Route');
const { validateRoute, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/routes
// @desc    Get all routes
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, trafficLevel, sortBy = 'routeId', sortOrder = 'asc' } = req.query;
    
    const query = {};
    if (trafficLevel) query.trafficLevel = trafficLevel;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const routes = await Route.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Route.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        routes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch routes',
      code: 'FETCH_ROUTES_ERROR'
    });
  }
});

// @route   GET /api/routes/:id
// @desc    Get route by ID
// @access  Private
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { route }
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch route',
      code: 'FETCH_ROUTE_ERROR'
    });
  }
});

// @route   POST /api/routes
// @desc    Create new route
// @access  Private
router.post('/', validateRoute, async (req, res) => {
  try {
    const route = new Route(req.body);
    route.fuelCost = route.calculateFuelCost();
    await route.save();

    res.status(201).json({
      status: 'success',
      message: 'Route created successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create route',
      code: 'CREATE_ROUTE_ERROR'
    });
  }
});

// @route   PUT /api/routes/:id
// @desc    Update route
// @access  Private
router.put('/:id', [validateObjectId, validateRoute], async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND'
      });
    }

    // Recalculate fuel cost
    route.fuelCost = route.calculateFuelCost();
    await route.save();

    res.status(200).json({
      status: 'success',
      message: 'Route updated successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update route',
      code: 'UPDATE_ROUTE_ERROR'
    });
  }
});

// @route   DELETE /api/routes/:id
// @desc    Delete route
// @access  Private
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        status: 'error',
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete route',
      code: 'DELETE_ROUTE_ERROR'
    });
  }
});

// @route   GET /api/routes/stats/summary
// @desc    Get route statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments();
    const trafficStats = await Route.aggregate([
      { $group: { _id: '$trafficLevel', count: { $sum: 1 } } }
    ]);
    const avgDistance = await Route.aggregate([
      { $group: { _id: null, avgDistance: { $avg: '$distanceKm' } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalRoutes,
        trafficStats,
        averageDistance: avgDistance[0]?.avgDistance || 0
      }
    });
  } catch (error) {
    console.error('Get route stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch route statistics',
      code: 'FETCH_ROUTE_STATS_ERROR'
    });
  }
});

module.exports = router;