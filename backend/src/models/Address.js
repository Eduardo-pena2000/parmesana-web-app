const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Casa',
    comment: 'e.g., Casa, Trabajo, Otro'
  },
  street: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  exteriorNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  interiorNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  neighborhood: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Cadereyta Jiménez'
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Nuevo León'
  },
  postalCode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  references: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Referencias para encontrar la dirección'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'addresses',
  indexes: [
    { fields: ['userId'] },
    { fields: ['isDefault'] }
  ]
});

module.exports = Address;
