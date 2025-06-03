const app = require('./src/app');
console.log('Server.js: app object required.'); // Nuevo log
console.log('Server.js: Type of app:', typeof app); // Nuevo log

const PORT = process.env.PORT || 3000;
console.log(`Server.js: Attempting to listen on port: ${PORT}`);
app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
console.log('Server.js: app.listen call finished.');