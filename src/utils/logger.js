const timestamp = () => new Date().toISOString();

const info = (message) => console.log(`[${timestamp()}] ${message}`);

const error = (message, err) => {
  console.error(`[${timestamp()}] ${message}`);
  if (err && err.stack) {
    console.error(err.stack);
  }
};

module.exports = { info, error };
