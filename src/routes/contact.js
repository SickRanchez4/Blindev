const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const catchAsync = require('../utils/catchAsync');

router.post('/', catchAsync(contactController.handleContactForm));

module.exports = router;