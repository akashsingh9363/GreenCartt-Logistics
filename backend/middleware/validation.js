const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateSignup = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['manager'])
    .withMessage('Role must be manager'),
  handleValidationErrors
];

const validateDriver = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('shiftHours')
    .isInt({ min: 1, max: 12 })
    .withMessage('Shift hours must be between 1 and 12'),
  body('pastWeekHours')
    .isArray({ min: 7, max: 7 })
    .withMessage('Past week hours must contain exactly 7 values')
    .custom((hours) => {
      if (!hours.every(h => Number.isInteger(h) && h >= 0 && h <= 12)) {
        throw new Error('Each hour value must be between 0 and 12');
      }
      return true;
    }),
  handleValidationErrors
];

const validateRoute = [
  body('routeId')
    .isInt({ min: 1 })
    .withMessage('Route ID must be a positive integer'),
  body('distanceKm')
    .isFloat({ min: 0.1, max: 1000 })
    .withMessage('Distance must be between 0.1 and 1000 km'),
  body('trafficLevel')
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Traffic level must be Low, Medium, or High'),
  body('baseTimeMin')
    .isInt({ min: 1, max: 480 })
    .withMessage('Base time must be between 1 and 480 minutes'),
  handleValidationErrors
];

const validateOrder = [
  body('orderId')
    .isInt({ min: 1 })
    .withMessage('Order ID must be a positive integer'),
  body('valueRs')
    .isFloat({ min: 1, max: 100000 })
    .withMessage('Order value must be between ₹1 and ₹100,000'),
  body('routeId')
    .isInt({ min: 1 })
    .withMessage('Route ID must be a positive integer'),
  body('deliveryTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Delivery time must be in HH:MM format'),
  handleValidationErrors
];

const validateSimulation = [
  body('drivers')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of drivers must be between 1 and 50'),
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('maxHours')
    .isInt({ min: 4, max: 12 })
    .withMessage('Max hours must be between 4 and 12'),
  body('fuelEfficiency')
    .optional()
    .isInt({ min: 70, max: 100 })
    .withMessage('Fuel efficiency must be between 70% and 100%'),
  body('weatherCondition')
    .optional()
    .isIn(['excellent', 'normal', 'poor', 'severe'])
    .withMessage('Weather condition must be excellent, normal, poor, or severe'),
  handleValidationErrors
];

const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateSignup,
  validateDriver,
  validateRoute,
  validateOrder,
  validateSimulation,
  validateObjectId,
  handleValidationErrors
};