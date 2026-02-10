const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const Reservation = require('./Reservation');

// Define relationships

// User - Address (One to Many)
User.hasMany(Address, {
  foreignKey: 'userId',
  as: 'addresses',
  onDelete: 'CASCADE'
});
Address.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Category - MenuItem (One to Many)
Category.hasMany(MenuItem, {
  foreignKey: 'categoryId',
  as: 'menuItems',
  onDelete: 'CASCADE'
});
MenuItem.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// User - Order (One to Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Address - Order (One to Many)
Address.hasMany(Order, {
  foreignKey: 'addressId',
  as: 'orders'
});
Order.belongsTo(Address, {
  foreignKey: 'addressId',
  as: 'address'
});

// User - Reservation (One to Many)
User.hasMany(Reservation, {
  foreignKey: 'userId',
  as: 'reservations'
});
Reservation.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Address,
  Category,
  MenuItem,
  Order,
  Reservation
};
