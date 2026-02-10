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
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/stats', getOrderStats);
router.get('/number/:orderNumber', getOrderByNumber);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/rate', rateOrder);

module.exports = router;
