const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getOrderByNumber,
  cancelOrder,
  rateOrder,
  getOrderStats
} = require('../controllers/orderController');
const { auth, optionalAuth } = require('../middleware/auth');

// Public routes (Guest Checkout)
router.post('/', optionalAuth, createOrder);
router.get('/number/:orderNumber', optionalAuth, getOrderByNumber); // Allow guests to track order

// Protected routes
router.use(auth);
router.get('/', getUserOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/rate', rateOrder);

module.exports = router;
