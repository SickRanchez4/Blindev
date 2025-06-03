console.log('app.js: Starting app initialization.');
const express = require('express');
const path = require('path');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
console.log('app.js: Serving static files from:', staticPath);
app.use(express.json());

app.use('/contact', contactRoutes);

module.exports = app;
console.log('app.js: App object exported.');