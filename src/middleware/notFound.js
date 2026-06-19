const AppError = require('../utils/AppError');

// 404 Not Found middleware
const notFound = (req, res, next) => {
  const message = `Cannot find ${req.originalUrl} on this server!`;
  const error = new AppError(message, 404);
  next(error);
};

module.exports = notFound;
