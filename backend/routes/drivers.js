const express = require('express');
const Driver = require('../models/Driver');
const { validateDriver, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/drivers
// @desc    Get all drivers
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const drivers = await Driver.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Driver.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        drivers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch drivers',
      code: 'FETCH_DRIVERS_ERROR'
    });
  }
});

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Private
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        status: 'error',
        message: 'Driver not found',
        code: 'DRIVER_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { driver }
    });
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch driver',
      code: 'FETCH_DRIVER_ERROR'
    });
  }
});

// @route   POST /api/drivers
// @desc    Create new driver
// @access  Private
router.post('/', validateDriver, async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();

    res.status(201).json({
      status: 'success',
      message: 'Driver created successfully',
      data: { driver }
    });
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create driver',
      code: 'CREATE_DRIVER_ERROR'
    });
  }
});

// @route   PUT /api/drivers/:id
// @desc    Update driver
// @access  Private
router.put('/:id', [validateObjectId, validateDriver], async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({
        status: 'error',
        message: 'Driver not found',
        code: 'DRIVER_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Driver updated successfully',
      data: { driver }
    });
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update driver',
      code: 'UPDATE_DRIVER_ERROR'
    });
  }
});

// @route   DELETE /api/drivers/:id
// @desc    Delete driver
// @access  Private
router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({
        status: 'error',
        message: 'Driver not found',
        code: 'DRIVER_NOT_FOUND'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete driver',
      code: 'DELETE_DRIVER_ERROR'
    });
  }
});

// @route   GET /api/drivers/stats/summary
// @desc    Get driver statistics
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const activeDrivers = await Driver.countDocuments({ status: 'Active' });
    const avgEfficiency = await Driver.aggregate([
      { $group: { _id: null, avgEfficiency: { $avg: '$efficiency' } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalDrivers,
        activeDrivers,
        offDutyDrivers: totalDrivers - activeDrivers,
        averageEfficiency: avgEfficiency[0]?.avgEfficiency || 0
      }
    });
  } catch (error) {
    console.error('Get driver stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch driver statistics',
      code: 'FETCH_DRIVER_STATS_ERROR'
    });
  }
});

module.exports = router;