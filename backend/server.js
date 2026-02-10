require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection, syncDatabase } = require('./src/config/database');

const app = express();

// Security middleware
app.use(helmet());
app.set('trust proxy', 1); // Trust first proxy (Render load balancer)

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://parmesana-web.onrender.com',
      ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('Origin blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (mount BEFORE rate limiting to avoid conflicts)
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/menu', require('./src/routes/menu'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/reservations', require('./src/routes/reservations'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api/seed', require('./src/routes/seed')); // Seed route

app.get('/api/test-menu', (req, res) => {
  console.log('Test Menu Route Hit');
  res.json({ message: 'Menu routes should be working' });
});

// Rate limiting (applied AFTER routes to avoid blocking them)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
});
app.use('/api', limiter);

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

    // Auto-seed menu if database is empty (prevents blank menu after redeploy)
    try {
      const { MenuItem, Category } = require('./src/models');
      const itemCount = await MenuItem.count();
      console.log(`📊 Menu items in database: ${itemCount}`);

      if (itemCount < 20) {
        console.log('🌱 Menu is empty/incomplete, auto-seeding...');
        const fs = require('fs');
        const path = require('path');
        const MENU_JSON_PATH = path.join(__dirname, 'src', 'data', 'menu.json');

        if (fs.existsSync(MENU_JSON_PATH)) {
          const menuData = JSON.parse(fs.readFileSync(MENU_JSON_PATH, 'utf8'));
          const { menu } = menuData;

          // Clear existing incomplete data
          await MenuItem.destroy({ where: {}, truncate: true, cascade: true });
          await Category.destroy({ where: {}, truncate: true, cascade: true });

          let totalItems = 0;
          for (const categoryData of menu) {
            const category = await Category.create({
              name: categoryData.category,
              slug: categoryData.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              description: `Categoría: ${categoryData.category}`,
              icon: categoryData.icon || '🍽️',
              isActive: true,
              order: menu.indexOf(categoryData)
            });

            for (const item of categoryData.items) {
              await MenuItem.create({
                name: item.name,
                slug: item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                description: item.description || '',
                basePrice: item.price || (item.sizes ? item.sizes[0].price : 0),
                image: item.image || '',
                categoryId: category.id,
                isAvailable: true,
                isFeatured: item.featured || false,
                isPopular: item.popular || false,
                sizes: item.sizes || null,
                extras: item.extras || null
              });
              totalItems++;
            }
          }
          console.log(`✅ Auto-seed complete: ${totalItems} items created`);
        }
      }
    } catch (seedError) {
      console.error('⚠️ Auto-seed failed (non-fatal):', seedError.message);
    }

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
