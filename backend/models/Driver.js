const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  shiftHours: {
    type: Number,
    required: [true, 'Shift hours is required'],
    min: [1, 'Shift hours must be at least 1'],
    max: [12, 'Shift hours cannot exceed 12']
  },
  pastWeekHours: {
    type: [Number],
    required: [true, 'Past week hours is required'],
    validate: {
      validator: function(hours) {
        return hours.length === 7 && hours.every(h => h >= 0 && h <= 12);
      },
      message: 'Past week hours must contain exactly 7 values between 0 and 12'
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Off-duty', 'On-break'],
    default: 'Active'
  },
  efficiency: {
    type: Number,
    min: [0, 'Efficiency cannot be negative'],
    max: [100, 'Efficiency cannot exceed 100'],
    default: 85
  },
  deliveries: {
    type: Number,
    min: [0, 'Deliveries cannot be negative'],
    default: 0
  },
  totalHoursWorked: {
    type: Number,
    default: 0
  },
  averageDeliveryTime: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate if driver is fatigued (worked >8 hours yesterday)
driverSchema.methods.isFatigued = function() {
  const yesterday = this.pastWeekHours[this.pastWeekHours.length - 1];
  return yesterday > 8;
};

// Calculate average hours worked in past week
driverSchema.methods.getAverageWeeklyHours = function() {
  const total = this.pastWeekHours.reduce((sum, hours) => sum + hours, 0);
  return total / 7;
};

module.exports = mongoose.model('Driver', driverSchema);