const { Category, MenuItem } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all categories with menu items
// @route   GET /api/menu/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const { includeItems } = req.query;

    const options = {
      where: { isActive: true },
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    };

    if (includeItems === 'true') {
      options.include = [{
        model: MenuItem,
        as: 'menuItems',
        where: { isAvailable: true },
        required: false,
        order: [['displayOrder', 'ASC'], ['name', 'ASC']]
      }];
    }

    const categories = await Category.findAll(options);

    res.json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/menu/categories/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { 
        slug: req.params.slug,
        isActive: true
      },
      include: [{
        model: MenuItem,
        as: 'menuItems',
        where: { isAvailable: true },
        required: false,
        order: [['displayOrder', 'ASC'], ['name', 'ASC']]
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categoría',
      error: error.message
    });
  }
};

// @desc    Get all menu items
// @route   GET /api/menu/items
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      isPopular, 
      isFeatured, 
      isNew,
      minPrice,
      maxPrice,
      tags,
      page = 1,
      limit = 20
    } = req.query;

    // Build where clause
    const where = { isAvailable: true };

    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (isPopular === 'true') where.isPopular = true;
    if (isFeatured === 'true') where.isFeatured = true;
    if (isNew === 'true') where.isNew = true;

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.basePrice[Op.lte] = parseFloat(maxPrice);
    }

    if (tags) {
      const tagArray = tags.split(',');
      where.tags = { [Op.overlap]: tagArray };
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: menuItems } = await MenuItem.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }],
      limit: parseInt(limit),
      offset,
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.json({
      success: true,
      count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      },
      data: { menuItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener items del menú',
      error: error.message
    });
  }
};

// @desc    Get menu item by slug
// @route   GET /api/menu/items/:slug
// @access  Public
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({
      where: { 
        slug: req.params.slug,
        isAvailable: true
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }]
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }

    res.json({
      success: true,
      data: { menuItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener item del menú',
      error: error.message
    });
  }
};

// @desc    Get popular items
// @route   GET /api/menu/popular
// @access  Public
exports.getPopularItems = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const menuItems = await MenuItem.findAll({
      where: { 
        isAvailable: true,
        isPopular: true
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }],
      limit: parseInt(limit),
      order: [
        ['orderCount', 'DESC'],
        ['rating', 'DESC']
      ]
    });

    res.json({
      success: true,
      count: menuItems.length,
      data: { menuItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener items populares',
      error: error.message
    });
  }
};

// @desc    Get featured items
// @route   GET /api/menu/featured
// @access  Public
exports.getFeaturedItems = async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const menuItems = await MenuItem.findAll({
      where: { 
        isAvailable: true,
        isFeatured: true
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }],
      limit: parseInt(limit),
      order: [['displayOrder', 'ASC']]
    });

    res.json({
      success: true,
      count: menuItems.length,
      data: { menuItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener items destacados',
      error: error.message
    });
  }
};

// @desc    Search menu items
// @route   GET /api/menu/search
// @access  Public
exports.searchMenu = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Búsqueda debe tener al menos 2 caracteres'
      });
    }

    const menuItems = await MenuItem.findAll({
      where: {
        isAvailable: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { ingredients: { [Op.contains]: [q] } },
          { tags: { [Op.contains]: [q] } }
        ]
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug', 'icon']
      }],
      limit: 20
    });

    res.json({
      success: true,
      count: menuItems.length,
      query: q,
      data: { menuItems }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda',
      error: error.message
    });
  }
};
