const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array de URLs de imágenes adicionales'
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  sizes: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array de {name, price, description}'
  },
  extras: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array de {name, price, description, available}'
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  allergens: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., ["gluten", "lactosa", "nueces"]'
  },
  nutritionalInfo: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Calories, protein, carbs, fat, etc.'
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    comment: 'Tiempo estimado en minutos'
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Descuento en porcentaje'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  orderCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Veces que se ha pedido'
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    comment: 'e.g., ["vegetariano", "picante", "sin gluten"]'
  }
}, {
  timestamps: true,
  tableName: 'menu_items',
  indexes: [
    { fields: ['categoryId'] },
    { fields: ['slug'] },
    { fields: ['isAvailable'] },
    { fields: ['isPopular'] },
    { fields: ['isFeatured'] },
    { fields: ['displayOrder'] }
  ]
});

// Method to calculate price with discount
MenuItem.prototype.getFinalPrice = function() {
  if (this.discount > 0) {
    return (this.basePrice * (1 - this.discount / 100)).toFixed(2);
  }
  return this.basePrice;
};

module.exports = MenuItem;
