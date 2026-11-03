require('dotenv').config();

const config = require('./src/config');
const app = require('./src/app');
const logger = require('./src/utils/logger');

const server = app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
});

const shutdown = (signal) => {
  logger.info(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err && err.message}`, err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, err);
  process.exit(1);
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
