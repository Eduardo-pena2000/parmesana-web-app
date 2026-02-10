require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection, syncDatabase } = require('./src/config/database');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/reservations', require('./src/routes/reservations'));
app.use('/api/payments', require('./src/routes/payments'));

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🍕 La Parmesana API está funcionando',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      reservations: '/api/reservations'
    }
  });
});

// Dashboard (para compatibilidad con el bot)
app.get('/dashboard', async (req, res) => {
  try {
    const { Order, User } = require('./src/models');

    const stats = {
      totalOrders: await Order.count(),
      totalUsers: await User.count(),
      pendingOrders: await Order.count({ where: { status: 'pending' } }),
      confirmedOrders: await Order.count({ where: { status: 'confirmed' } }),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Dashboard de La Parmesana',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database (create tables if they don't exist)
    await syncDatabase(false); // Set to true to force recreate tables

    // Start listening
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🍕  LA PARMESANA - Backend API                          ║
║                                                            ║
║   Server running on port ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║   Database: Connected ✅                                  ║
║                                                            ║
║   API Documentation:                                       ║
║   - Health: http://localhost:${PORT}                          ║
║   - Auth: http://localhost:${PORT}/api/auth                   ║
║   - Menu: http://localhost:${PORT}/api/menu                   ║
║   - Orders: http://localhost:${PORT}/api/orders               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
