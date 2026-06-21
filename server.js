require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const PORT = process.env.PORT || 3000;
const app = require('./src/app');

const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION: ${err.message}`);
  console.error(err.stack);
  // Gracefully shut down
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] SIGTERM signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
