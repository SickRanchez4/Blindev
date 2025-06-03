const express = require('express');
const path = require('path');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

app.use('/contact', contactRoutes);

module.exports = app;