const AppError = require('../utils/AppError');

// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error with timestamp
  console.error(`[${new Date().toISOString()}] ERROR ${err.statusCode}: ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = `Invalid input data. ${Object.values(err.errors)
      .map((val) => val.message)
      .join('. ')}`;
    err = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists. Please use another value.`;
    err = new AppError(message, 400);
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    message: err.message,
    timestamp: err.timestamp || new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
