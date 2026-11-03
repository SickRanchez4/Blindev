const rateLimit = require('express-rate-limit');
const config = require('../config');

const contactRateLimiter = rateLimit({
  windowMs: config.contactRateLimit.windowMs,
  max: config.contactRateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many contact requests. Please try again later.',
  },
});

module.exports = { contactRateLimiter };
