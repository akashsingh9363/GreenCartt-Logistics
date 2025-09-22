const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parameters: {
    drivers: {
      type: Number,
      required: true,
      min: [1, 'Number of drivers must be at least 1'],
      max: [50, 'Number of drivers cannot exceed 50']
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
    },
    maxHours: {
      type: Number,
      required: true,
      min: [4, 'Max hours must be at least 4'],
      max: [12, 'Max hours cannot exceed 12']
    },
    routeOptimization: {
      type: Boolean,
      default: true
    },
    fuelEfficiency: {
      type: Number,
      min: [70, 'Fuel efficiency must be at least 70%'],
      max: [100, 'Fuel efficiency cannot exceed 100%'],
      default: 85
    },
    weatherCondition: {
      type: String,
      enum: ['excellent', 'normal', 'poor', 'severe'],
      default: 'normal'
    }
  },
  results: {
    totalProfit: {
      type: Number,
      required: true
    },
    efficiencyScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    onTimeDeliveries: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    lateDeliveries: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    totalFuelCost: {
      type: Number,
      required: true
    },
    avgDeliveryTime: {
      type: Number,
      required: true
    },
    totalOrders: {
      type: Number,
      required: true
    },
    totalPenalties: {
      type: Number,
      default: 0
    },
    totalBonuses: {
      type: Number,
      default: 0
    }
  },
  executionTime: {
    type: Number, // in milliseconds
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'failed', 'in_progress'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Index for efficient querying
simulationSchema.index({ userId: 1, createdAt: -1 });
simulationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Simulation', simulationSchema);