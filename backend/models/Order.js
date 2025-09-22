const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: [true, 'Order ID is required'],
    unique: true,
    min: [1, 'Order ID must be positive']
  },
  customer: {
    type: String,
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  valueRs: {
    type: Number,
    required: [true, 'Order value is required'],
    min: [1, 'Order value must be at least ₹1'],
    max: [100000, 'Order value cannot exceed ₹100,000']
  },
  routeId: {
    type: Number,
    required: [true, 'Route ID is required'],
    ref: 'Route'
  },
  deliveryTime: {
    type: String,
    required: [true, 'Delivery time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Delivery time must be in HH:MM format']
  },
  deliveryTimeMinutes: {
    type: Number,
    default: function() {
      const [hours, minutes] = this.deliveryTime.split(':').map(Number);
      return hours * 60 + minutes;
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  isOnTime: {
    type: Boolean,
    default: null
  },
  penalty: {
    type: Number,
    default: 0
  },
  bonus: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate if delivery is on time based on route base time
orderSchema.methods.calculateOnTime = function(route) {
  const allowedTime = route.baseTimeMin + 10; // 10 minutes grace period
  return this.deliveryTimeMinutes <= allowedTime;
};

// Calculate penalty for late delivery
orderSchema.methods.calculatePenalty = function(route) {
  const isOnTime = this.calculateOnTime(route);
  return isOnTime ? 0 : 50; // ₹50 penalty for late delivery
};

// Calculate bonus for high-value on-time delivery
orderSchema.methods.calculateBonus = function(route) {
  const isOnTime = this.calculateOnTime(route);
  const isHighValue = this.valueRs > 1000;
  return (isHighValue && isOnTime) ? this.valueRs * 0.1 : 0; // 10% bonus
};

// Calculate total profit for this order
orderSchema.methods.calculateProfit = function(route) {
  const penalty = this.calculatePenalty(route);
  const bonus = this.calculateBonus(route);
  const fuelCost = route.calculateFuelCost();
  
  return this.valueRs + bonus - penalty - fuelCost;
};

module.exports = mongoose.model('Order', orderSchema);