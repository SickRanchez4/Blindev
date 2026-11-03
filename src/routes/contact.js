const express = require('express');
const { handleContactForm } = require('../controllers/contactController');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.post('/', catchAsync(handleContactForm));

module.exports = router;
