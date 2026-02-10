const { Order, User, Address, MenuItem } = require('../models');
const { Op } = require('sequelize');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      type = 'delivery', // Default to delivery if not specified
      addressId,
      shippingAddress: rawAddress, // Accept raw address object
      paymentMethod,
      notes,
      deliveryTime,
      status = 'pending', // Accept status (e.g. 'paid')
      transactionId // Accept transactionId
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe contener al menos un item'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);

      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.menuItemId} no está disponible`
        });
      }

      let itemPrice = parseFloat(menuItem.basePrice);

      // Calculate price based on size if specified
      if (item.size && menuItem.sizes) {
        const size = menuItem.sizes.find(s => s.name === item.size);
        if (size) itemPrice = parseFloat(size.price);
      }

      // Add extras
      let extrasTotal = 0;
      const selectedExtras = [];

      if (item.extras && Array.isArray(item.extras)) {
        for (const extraName of item.extras) {
          const extra = menuItem.extras?.find(e => e.name === extraName);
          if (extra) {
            extrasTotal += parseFloat(extra.price);
            selectedExtras.push({
              name: extra.name,
              price: extra.price
            });
          }
        }
      }

      const itemTotal = (itemPrice + extrasTotal) * item.quantity;
      subtotal += itemTotal;

      enrichedItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        image: menuItem.image,
        basePrice: menuItem.basePrice,
        size: item.size || null,
        sizePrice: item.size ? itemPrice : null,
        extras: selectedExtras,
        quantity: item.quantity,
        notes: item.notes || null,
        total: itemTotal.toFixed(2)
      });
    }

    // Calculate additional fees
    const taxRate = parseFloat(process.env.TAX_RATE) || 0.16;
    const tax = (subtotal * taxRate).toFixed(2);

    let deliveryFee = 0;
    if (type === 'delivery') {
      const minForFree = parseFloat(process.env.FREE_DELIVERY_MINIMUM) || 300;
      if (subtotal < minForFree) {
        deliveryFee = parseFloat(process.env.DELIVERY_FEE) || 30;
      }
    }

    const total = (parseFloat(subtotal) + parseFloat(tax) + parseFloat(deliveryFee)).toFixed(2);

    // Get address info if delivery
    let deliveryAddress = null;
    if (type === 'delivery') {
      if (addressId) {
        const address = await Address.findOne({
          where: {
            id: addressId,
            userId: req.user.id
          }
        });

        if (!address) {
          return res.status(404).json({
            success: false,
            message: 'Dirección no encontrada'
          });
        }
        deliveryAddress = address.toJSON();
      } else if (rawAddress) {
        // Use the raw address provided in the request
        deliveryAddress = rawAddress;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una dirección de envío'
        });
      }
    }

    // Generate order number manually to avoid validation error
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `LP${year}${month}${day}${random}`;

    // Create order
    const order = await Order.create({
      orderNumber, // Add generated order number
      userId: req.user.id,
      addressId: type === 'delivery' ? addressId : null,
      source: 'web',
      type,
      items: enrichedItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      deliveryAddress,
      deliveryTime: deliveryTime || null,
      notes,
      estimatedDelivery: type === 'delivery' ? 45 : 20,
      status: status, // Use provided status
      paymentStatus: status === 'confirmed' ? 'approved' : 'pending', // Set payment status based on order status
      transactionId: transactionId // Save transaction ID
    });

    // Calculate loyalty points (1 punto por cada peso)
    const pointsEarned = Math.floor(parseFloat(total));
    order.pointsEarned = pointsEarned;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear pedido',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'phone']
      }]
    });

    res.json({
      success: true,
      count,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      },
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos',
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido',
      error: error.message
    });
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/number/:orderNumber
// @access  Private
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        orderNumber: req.params.orderNumber,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedido',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Can only cancel if pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar este pedido'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    await order.save();

    res.json({
      success: true,
      message: 'Pedido cancelado exitosamente',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar pedido',
      error: error.message
    });
  }
};

// @desc    Rate order
// @route   PUT /api/orders/:id/rate
// @access  Private
exports.rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Calificación debe estar entre 1 y 5'
      });
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Can only rate delivered orders
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden calificar pedidos entregados'
      });
    }

    order.rating = rating;
    order.review = review || null;
    await order.save();

    res.json({
      success: true,
      message: 'Gracias por tu calificación',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al calificar pedido',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = {
      totalOrders: await Order.count({ where: { userId } }),
      pendingOrders: await Order.count({ where: { userId, status: 'pending' } }),
      confirmedOrders: await Order.count({ where: { userId, status: 'confirmed' } }),
      preparingOrders: await Order.count({ where: { userId, status: 'preparing' } }),
      onDeliveryOrders: await Order.count({ where: { userId, status: 'on-delivery' } }),
      deliveredOrders: await Order.count({ where: { userId, status: 'delivered' } }),
      cancelledOrders: await Order.count({ where: { userId, status: 'cancelled' } })
    };

    // Get total spent
    const orders = await Order.findAll({
      where: {
        userId,
        status: { [Op.in]: ['delivered', 'confirmed'] }
      },
      attributes: ['total']
    });

    stats.totalSpent = orders.reduce((sum, order) => {
      return sum + parseFloat(order.total);
    }, 0).toFixed(2);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};
