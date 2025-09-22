const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: Number,
    required: [true, 'Route ID is required'],
    unique: true,
    min: [1, 'Route ID must be positive']
  },
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  distanceKm: {
    type: Number,
    required: [true, 'Distance is required'],
    min: [0.1, 'Distance must be at least 0.1 km'],
    max: [1000, 'Distance cannot exceed 1000 km']
  },
  trafficLevel: {
    type: String,
    required: [true, 'Traffic level is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Traffic level must be Low, Medium, or High'
    }
  },
  baseTimeMin: {
    type: Number,
    required: [true, 'Base time is required'],
    min: [1, 'Base time must be at least 1 minute'],
    max: [480, 'Base time cannot exceed 8 hours']
  },
  fuelCost: {
    type: Number,
    default: function() {
      // Base cost: ₹5/km + High traffic surcharge: ₹2/km
      const baseCost = this.distanceKm * 5;
      const surcharge = this.trafficLevel === 'High' ? this.distanceKm * 2 : 0;
      return baseCost + surcharge;
    }
  },
  avgDeliveryTime: {
    type: Number,
    default: function() {
      return this.baseTimeMin;
    }
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  successfulDeliveries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate fuel cost based on company rules
routeSchema.methods.calculateFuelCost = function() {
  const baseCost = this.distanceKm * 5; // ₹5/km base cost
  const surcharge = this.trafficLevel === 'High' ? this.distanceKm * 2 : 0; // +₹2/km for high traffic
  return baseCost + surcharge;
};

// Calculate success rate
routeSchema.methods.getSuccessRate = function() {
  if (this.totalOrders === 0) return 0;
  return (this.successfulDeliveries / this.totalOrders) * 100;
};

module.exports = mongoose.model('Route', routeSchema);