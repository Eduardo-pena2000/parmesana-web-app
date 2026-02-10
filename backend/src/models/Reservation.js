const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reservation = sequelize.define('Reservation', {
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
    }
  },
  reservationNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 20
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'arrived', 'completed', 'cancelled', 'no-show'),
    defaultValue: 'pending'
  },
  tableNumber: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  occasion: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'e.g., cumpleaños, aniversario, etc.'
  },
  contactPhone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  contactName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  arrivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'reservations',
  indexes: [
    { fields: ['userId'] },
    { fields: ['date', 'time'] },
    { fields: ['status'] },
    { fields: ['reservationNumber'] }
  ]
});

// Generate reservation number
Reservation.beforeCreate(async (reservation) => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  reservation.reservationNumber = `RES${year}${month}${day}${random}`;
});

module.exports = Reservation;
