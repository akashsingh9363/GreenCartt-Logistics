const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      status: 'error',
      message,
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      status: 'error',
      message,
      code: 'DUPLICATE_FIELD',
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      status: 'error',
      message,
      code: 'VALIDATION_ERROR',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      status: 'error',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      status: 'error',
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
      statusCode: 401
    };
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };