require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Category, MenuItem, sequelize } = require('./src/models');

// Adjust path to where the bot folder is located relative to backend
// c:\Users\super\Desktop\parmesana-bot\src\data\menu.json
const MENU_JSON_PATH = path.join('C:', 'Users', 'super', 'Desktop', 'parmesana-bot', 'src', 'data', 'menu.json');

const importMenu = async () => {
    try {
        console.log('🚀 Iniciando importación del menú completo...\n');

        // Check if file exists
        if (!fs.existsSync(MENU_JSON_PATH)) {
            throw new Error(`No se encontró el archivo de menú en: ${MENU_JSON_PATH}`);
        }

        const menuData = JSON.parse(fs.readFileSync(MENU_JSON_PATH, 'utf8'));
        const { menu } = menuData;

        // Reset Database (optional, but safer to avoid duplicates during dev)
        // await sequelize.sync({ force: true }); 
        // console.log('🗑️  Base de datos limpiada (tablas recreadas).');

        // But since we want to keep User/Orders if possible, let's just destroy MenuItems and Categories?
        // Actually, force:true is better to ensure clean IDs and references, 
        // BUT user might have created an admin account. 
        // Let's truncatetable MenuItem and Category only.
        await MenuItem.destroy({ where: {}, truncate: true, cascade: true });
        await Category.destroy({ where: {}, truncate: true, cascade: true });
        console.log('🗑️  Menú anterior eliminado.');

        // 1. Define Categories mapping
        // Map JSON keys to Category definitions
        const categoryDefinitions = [
            { key: 'pizzas_clasicas', name: 'Pizzas', slug: 'pizzas', icon: '🍕', order: 1 },
            { key: 'pizzas_premium', name: 'Pizzas', slug: 'pizzas', icon: '🍕', order: 1 }, // Merge into Pizzas
            { key: 'hamburguesas', name: 'Hamburguesas', slug: 'hamburguesas', icon: '🍔', order: 2 },
            { key: 'tacos', name: 'Tacos', slug: 'tacos', icon: '🌮', order: 3 },
            { key: 'alitas_y_boneless', name: 'Alitas y Boneless', slug: 'alitas', icon: '🍗', order: 4 },
            { key: 'pastas', name: 'Pastas', slug: 'pastas', icon: '🍝', order: 5 },
            { key: 'burritos', name: 'Burritos', slug: 'burritos', icon: '🌯', order: 6 },
            { key: 'grill', name: 'Grill & Ribs', slug: 'grill', icon: '🔥', order: 7 },
            { key: 'ensaladas', name: 'Ensaladas', slug: 'ensaladas', icon: '🥗', order: 8 },
            { key: 'entradas', name: 'Entradas', slug: 'entradas', icon: '🍟', order: 9 },
            { key: 'bebidas', name: 'Bebidas', slug: 'bebidas', icon: '🥤', order: 10 },
            { key: 'postres', name: 'Postres', slug: 'postres', icon: '🍰', order: 11 },
            { key: 'promociones', name: 'Promociones', slug: 'promociones', icon: '🎁', order: 12 }
        ];

        // Helper to generate slug
        const generateSlug = (text) => text.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // 2. Create Categories (Deduplicate first)
        const uniqueCategories = [];
        const categoryMap = new Map(); // slug -> CategoryModel

        for (const def of categoryDefinitions) {
            if (!categoryMap.has(def.slug)) {
                console.log(`📂 Creando categoría: ${def.name}`);
                const cat = await Category.create({
                    name: def.name,
                    slug: def.slug,
                    icon: def.icon,
                    displayOrder: def.order,
                    isActive: true
                });
                categoryMap.set(def.slug, cat);
            }
        }

        // 3. Import Items
        console.log('\n🍽️  Importando platillos...');

        for (const def of categoryDefinitions) {
            const items = menu[def.key];
            if (!items) continue;

            const category = categoryMap.get(def.slug);

            for (const item of items) {
                // Prepare data
                const basePrice = item.price || (item.sizes ? Object.values(item.sizes)[0] : 0);

                // Transform sizes object to array if needed
                let sizesArray = [];
                if (item.sizes) {
                    sizesArray = Object.entries(item.sizes).map(([name, price]) => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        price: price,
                        description: '' // Optional description
                    }));
                }

                // Transform extras if needed
                let extrasArray = [];
                if (item.extras) {
                    // Provide structure if it's just an array of objects like [{"queso": 30}]
                    extrasArray = item.extras.map(ex => {
                        const key = Object.keys(ex)[0];
                        const val = Object.values(ex)[0];
                        return {
                            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                            price: val,
                            available: true
                        };
                    });
                }

                const isPopular = item.id === 'PZ001' || item.id === 'PP001' || item.id === 'H001'; // Just some logic
                const isFeatured = item.description && item.description.length > 20;

                await MenuItem.create({
                    categoryId: category.id,
                    name: item.name,
                    slug: generateSlug(item.name) + '-' + item.id, // Ensure unique slug
                    description: item.description || '',
                    basePrice: basePrice,
                    sizes: sizesArray,
                    extras: extrasArray,
                    ingredients: [], // Could parse description but keeping empty for now
                    isPopular: isPopular,
                    isFeatured: isFeatured,
                    displayOrder: 0
                });
                // console.log(`   - ${item.name}`);
            }
        }

        console.log('\n✅ Importación completada con éxito!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error en la importación:', error);
        process.exit(1);
    }
};

importMenu();
