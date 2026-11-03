const config = require('../config');
const logger = require('../utils/logger');

const INTERNAL_ERROR_MESSAGE = 'Something went wrong. Please try again later.';

// Errors created by us (AppError) or by http-errors with `expose` (e.g. malformed JSON) are safe to show.
const isSafeToExpose = (err) => Boolean(err.isOperational || err.expose);

const resolveStatusCode = (err) => {
  const statusCode = err.statusCode || err.status;
  return Number.isInteger(statusCode) && statusCode >= 400 ? statusCode : 500;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = resolveStatusCode(err);
  logger.error(`ERROR ${statusCode}: ${err.message}`, statusCode >= 500 ? err : undefined);

  const message = isSafeToExpose(err) || !config.isProduction ? err.message : INTERNAL_ERROR_MESSAGE;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    timestamp: err.timestamp || new Date().toISOString(),
    ...(config.isDevelopment && { stack: err.stack }),
  });
};

module.exports = errorHandler;
