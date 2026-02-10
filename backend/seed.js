require('dotenv').config();
const { Category, MenuItem, User } = require('./src/models');
const { syncDatabase } = require('./src/config/database');

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // Sync database (safe - only create missing tables)
    await syncDatabase();

    // Create Admin User (skip if already exists)
    console.log('👤 Creando usuario administrador...');
    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@laparmesana.com' },
      defaults: {
        phone: '+528281005914',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'La Parmesana',
        role: 'admin',
        isVerified: true
      }
    });
    console.log(created ? '✅ Admin creado' : '✅ Admin ya existía, omitiendo');

    // Create Categories
    console.log('📂 Creando categorías...');
    const categories = await Category.bulkCreate([
      {
        name: 'Pizzas',
        slug: 'pizzas',
        description: 'Nuestras deliciosas pizzas con masa artesanal',
        icon: '🍕',
        displayOrder: 1
      },
      {
        name: 'Hamburguesas',
        slug: 'hamburguesas',
        description: 'Hamburguesas jugosas y deliciosas',
        icon: '🍔',
        displayOrder: 2
      },
      {
        name: 'Pastas',
        slug: 'pastas',
        description: 'Pastas frescas al estilo italiano',
        icon: '🍝',
        displayOrder: 3
      },
      {
        name: 'Alitas',
        slug: 'alitas',
        description: 'Alitas crujientes con diferentes salsas',
        icon: '🍗',
        displayOrder: 4
      },
      {
        name: 'Ensaladas',
        slug: 'ensaladas',
        description: 'Ensaladas frescas y saludables',
        icon: '🥗',
        displayOrder: 5
      },
      {
        name: 'Bebidas',
        slug: 'bebidas',
        description: 'Refrescos, jugos y más',
        icon: '🥤',
        displayOrder: 6
      },
      {
        name: 'Postres',
        slug: 'postres',
        description: 'Dulces tentaciones para terminar',
        icon: '🍰',
        displayOrder: 7
      }
    ]);
    console.log('✅ Categorías creadas\n');

    // Create Menu Items
    console.log('🍽️  Creando items del menú...');

    // Pizzas
    const pizzaCategory = categories.find(c => c.slug === 'pizzas');
    await MenuItem.bulkCreate([
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Parmesana',
        slug: 'pizza-parmesana',
        description: 'Nuestra pizza especial con 10 ingredientes premium',
        basePrice: 270,
        sizes: [
          { name: 'Individual', price: 100, description: '20cm' },
          { name: 'Mediana', price: 215, description: '30cm' },
          { name: 'Grande', price: 270, description: '35cm' },
          { name: 'Familiar', price: 325, description: '40cm' }
        ],
        extras: [
          { name: 'Extra queso', price: 55, available: true },
          { name: 'Orilla de queso muncher', price: 65, available: true },
          { name: 'Champiñones', price: 40, available: true },
          { name: 'Pepperoni extra', price: 50, available: true }
        ],
        ingredients: ['Queso mozzarella', 'Jamón', 'Pepperoni', 'Salchicha', 'Champiñones', 'Pimiento', 'Cebolla', 'Aceitunas', 'Tomate', 'Orégano'],
        preparationTime: 25,
        isPopular: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 234,
        orderCount: 1205,
        tags: ['especialidad', 'favorita'],
        displayOrder: 1
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Hawaiana',
        slug: 'pizza-hawaiana',
        description: 'Jamón y piña en perfecta armonía',
        basePrice: 230,
        sizes: [
          { name: 'Individual', price: 90, description: '20cm' },
          { name: 'Mediana', price: 180, description: '30cm' },
          { name: 'Grande', price: 230, description: '35cm' },
          { name: 'Familiar', price: 280, description: '40cm' }
        ],
        extras: [
          { name: 'Extra queso', price: 55, available: true },
          { name: 'Orilla de queso', price: 65, available: true }
        ],
        ingredients: ['Queso mozzarella', 'Jamón', 'Piña'],
        preparationTime: 20,
        isPopular: true,
        rating: 4.5,
        reviewCount: 189,
        orderCount: 856,
        tags: ['clásica'],
        displayOrder: 2
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Pepperoni',
        slug: 'pizza-pepperoni',
        description: 'Clásica pizza con pepperoni de alta calidad',
        basePrice: 220,
        sizes: [
          { name: 'Individual', price: 85, description: '20cm' },
          { name: 'Mediana', price: 170, description: '30cm' },
          { name: 'Grande', price: 220, description: '35cm' },
          { name: 'Familiar', price: 270, description: '40cm' }
        ],
        extras: [
          { name: 'Extra pepperoni', price: 50, available: true },
          { name: 'Extra queso', price: 55, available: true }
        ],
        ingredients: ['Queso mozzarella', 'Pepperoni', 'Salsa de tomate'],
        preparationTime: 18,
        isPopular: true,
        rating: 4.7,
        reviewCount: 312,
        orderCount: 1420,
        tags: ['clásica', 'favorita'],
        displayOrder: 3
      },
      {
        categoryId: pizzaCategory.id,
        name: 'Pizza Vegetariana',
        slug: 'pizza-vegetariana',
        description: 'Llena de vegetales frescos y saludables',
        basePrice: 210,
        sizes: [
          { name: 'Individual', price: 80, description: '20cm' },
          { name: 'Mediana', price: 165, description: '30cm' },
          { name: 'Grande', price: 210, description: '35cm' },
          { name: 'Familiar', price: 260, description: '40cm' }
        ],
        ingredients: ['Queso mozzarella', 'Champiñones', 'Pimiento', 'Cebolla', 'Tomate', 'Aceitunas', 'Espinacas'],
        preparationTime: 22,
        rating: 4.4,
        reviewCount: 98,
        orderCount: 342,
        tags: ['vegetariana', 'saludable'],
        displayOrder: 4
      }
    ]);

    // Hamburguesas
    const hamburguesaCategory = categories.find(c => c.slug === 'hamburguesas');
    await MenuItem.bulkCreate([
      {
        categoryId: hamburguesaCategory.id,
        name: 'Hamburguesa Parmesana',
        slug: 'hamburguesa-parmesana',
        description: 'Nuestra hamburguesa especial con todos los ingredientes',
        basePrice: 120,
        ingredients: ['Carne 180g', 'Queso', 'Jamón', 'Tocino', 'Lechuga', 'Tomate', 'Cebolla', 'Aderezo especial'],
        extras: [
          { name: 'Tocino extra', price: 25, available: true },
          { name: 'Queso extra', price: 20, available: true },
          { name: 'Papas fritas', price: 35, available: true }
        ],
        preparationTime: 15,
        isPopular: true,
        rating: 4.6,
        reviewCount: 145,
        orderCount: 678,
        tags: ['especialidad'],
        displayOrder: 1
      },
      {
        categoryId: hamburguesaCategory.id,
        name: 'Hamburguesa Sencilla',
        slug: 'hamburguesa-sencilla',
        description: 'Hamburguesa clásica con lo esencial',
        basePrice: 75,
        ingredients: ['Carne 150g', 'Queso', 'Lechuga', 'Tomate', 'Cebolla'],
        preparationTime: 12,
        rating: 4.3,
        reviewCount: 87,
        orderCount: 445,
        displayOrder: 2
      }
    ]);

    // Bebidas
    const bebidaCategory = categories.find(c => c.slug === 'bebidas');
    await MenuItem.bulkCreate([
      {
        categoryId: bebidaCategory.id,
        name: 'Coca-Cola',
        slug: 'coca-cola',
        description: 'Refresco Coca-Cola 600ml',
        basePrice: 25,
        sizes: [
          { name: '600ml', price: 25 },
          { name: '1.5L', price: 35 },
          { name: '2L', price: 45 }
        ],
        preparationTime: 2,
        isPopular: true,
        rating: 4.8,
        reviewCount: 523,
        orderCount: 2341,
        displayOrder: 1
      },
      {
        categoryId: bebidaCategory.id,
        name: 'Agua Natural',
        slug: 'agua-natural',
        description: 'Agua embotellada 600ml',
        basePrice: 20,
        preparationTime: 1,
        rating: 4.9,
        reviewCount: 287,
        orderCount: 1876,
        displayOrder: 2
      },
      {
        categoryId: bebidaCategory.id,
        name: 'Jugo Natural',
        slug: 'jugo-natural',
        description: 'Jugo de naranja recién exprimido',
        basePrice: 35,
        preparationTime: 5,
        rating: 4.7,
        reviewCount: 156,
        orderCount: 567,
        tags: ['natural', 'saludable'],
        displayOrder: 3
      }
    ]);

    console.log('✅ Items del menú creados\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Seed completado exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Usuarios: 1 (admin)`);
    console.log(`   - Categorías: ${categories.length}`);
    console.log(`   - Items del menú: ${await MenuItem.count()}`);
    console.log('\n📝 Credenciales de admin:');
    console.log('   Email: admin@laparmesana.com');
    console.log('   Password: admin123');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedData();
