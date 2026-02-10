const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');

router.post('/create-payment-intent', optionalAuth, paymentController.createPaymentIntent);

module.exports = router;
