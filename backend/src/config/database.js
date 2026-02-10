const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
  : new Sequelize(
    process.env.DB_NAME || 'parmesana_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Sync database (create tables)
const syncDatabase = async (force = false) => {
  try {
    // In production: just create tables if missing (NO alter - it destroys data!)
    // In development: use alter to auto-update table structure
    const isProduction = process.env.NODE_ENV === 'production';
    const syncOptions = force
      ? { force: true }
      : isProduction
        ? {} // Production: only create missing tables, never alter
        : { alter: true }; // Dev: auto-update structure

    await sequelize.sync(syncOptions);
    console.log(`✅ Database synchronized (${force ? 'forced' : isProduction ? 'safe mode' : 'alter mode'})`);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
