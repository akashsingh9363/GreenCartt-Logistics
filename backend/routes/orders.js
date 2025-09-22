const express = require('express');
const Order = require('../models/Order');
const Route = require('../models/Route');
const { validateOrder, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, sortBy = 'orderId', sortOrder = 'asc' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('assignedDriver', 'name status efficiency')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
      code: 'FETCH_ORDERS_ERROR'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('assignedDriver', 'name status efficiency');
    
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order',
      code: 'FETCH_ORDER_ERROR'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', validateOrder, async (req, res) => {
  try {
    // Check if route exists
    const route = await Route.findOne({ routeId: req.body.routeId });
    if (!route) {
      return res.status(400).json({
        status: 'error',
        message: 'Route not found',
        code: 'ROUTE_NOT_FOUND'
      });
    }

    const order = new Order(req.body);
    
    // Calculate delivery time in minutes
    const [hours, minutes] = order.deliveryTime.split(':').map(Number);
    order.deliveryTimeMinutes = hours * 60 + minutes;
    
    // Calculate profit, penalty, and bonus
    order.isOnTime = order.calculateOnTime(route);
    order.penalty = order.calculatePenalty(route);
    order.bonus = order.calculateBonus(route);
    order.profit = order.calculateProfit(route);
    
    await order.save();

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
      code: 'CREATE_ORDER_ERROR'
    });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order
// @access  Private
router.put('/:id', [validateObjectId, validateOrder], async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    // Recalculate metrics if route changed
    if (req.body.routeId) {
      const route = await Route.findOne({ routeId: req.body.routeId });
      if (route) {
        order.isOnTime = order.calculateOnTime(route);
        order.penalty = order.calculatePenalty(route);
        order.bonus = order.calculateBonus(route);
        order.profit = order.calculateProfit(route);
        await order.save();
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order',
      code: 'UPDATE_ORDER_ERROR'
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
        code: 'ORDER_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete order',
      code: 'DELETE_ORDER_ERROR'
    });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const statusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const totalValue = await Order.aggregate([
      { $group: { _id: null, totalValue: { $sum: '$valueRs' } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        statusStats,
        totalValue: totalValue[0]?.totalValue || 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order statistics',
      code: 'FETCH_ORDER_STATS_ERROR'
    });
  }
});

module.exports = router;