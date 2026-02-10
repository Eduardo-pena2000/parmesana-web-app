const express = require('express');
console.log('✅ Menu Routes Loaded');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  getMenuItems,
  getMenuItem,
  getPopularItems,
  getFeaturedItems,
  searchMenu
} = require('../controllers/menuController');

// Public routes
router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/items', getMenuItems);
router.get('/items/:slug', getMenuItem);
router.get('/popular', getPopularItems);
router.get('/featured', getFeaturedItems);
router.get('/search', searchMenu);

module.exports = router;
