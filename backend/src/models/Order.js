const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  addressId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  source: {
    type: DataTypes.ENUM('web', 'whatsapp', 'phone'),
    defaultValue: 'web'
  },
  type: {
    type: DataTypes.ENUM('delivery', 'pickup', 'dine-in'),
    defaultValue: 'delivery'
  },
  status: {
    type: DataTypes.ENUM(
      'pending',      // Pendiente de pago
      'confirmed',    // Confirmado (pagado)
      'preparing',    // En preparación
      'ready',        // Listo
      'on-delivery',  // En camino
      'delivered',    // Entregado
      'cancelled',    // Cancelado
      'refunded'      // Reembolsado
    ),
    defaultValue: 'pending'
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array de items del pedido con detalles'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('card', 'cash', 'transfer'),
    defaultValue: 'card'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'refunded'),
    defaultValue: 'pending'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'ID del pago en Mercado Pago'
  },
  paymentDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  deliveryAddress: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Snapshot de la dirección de entrega'
  },
  deliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.INTEGER,
    defaultValue: 45,
    comment: 'Tiempo estimado en minutos'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notas del cliente'
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pointsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'orders',
  indexes: [
    { fields: ['userId'] },
    { fields: ['orderNumber'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] },
    { fields: ['source'] },
    { fields: ['createdAt'] }
  ]
});

// Generate order number
Order.beforeCreate(async (order) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  order.orderNumber = `LP${year}${month}${day}${random}`;
});

module.exports = Order;
