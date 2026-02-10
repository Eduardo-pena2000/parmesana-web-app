const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth: protect } = require('../middleware/auth'); // Renaming auth to protect for consistency

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);

module.exports = router;
