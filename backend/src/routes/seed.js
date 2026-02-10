const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Category, MenuItem } = require('../models');

// Adjust path to point to backend/src/data/menu.json
const MENU_JSON_PATH = path.join(__dirname, '..', 'data', 'menu.json');

router.post('/menu', async (req, res) => {
    try {
        console.log('🚀 Iniciando importación del menú completo...');

        if (!fs.existsSync(MENU_JSON_PATH)) {
            return res.status(404).json({ message: 'Archivo menu.json no encontrado' });
        }

        const menuData = JSON.parse(fs.readFileSync(MENU_JSON_PATH, 'utf8'));
        const { menu } = menuData;

        // Reset Database
        await MenuItem.destroy({ where: {}, truncate: true, cascade: true });
        await Category.destroy({ where: {}, truncate: true, cascade: true });
        console.log('🗑️  Menú anterior eliminado.');

        // 1. Define Categories (same logic as script)
        const categoryDefinitions = [
            { key: 'pizzas_clasicas', name: 'Pizzas', slug: 'pizzas', icon: '🍕', order: 1 },
            { key: 'pizzas_premium', name: 'Pizzas', slug: 'pizzas', icon: '🍕', order: 1 },
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

        const generateSlug = (text) => text.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        // 2. Create Categories
        const categoryMap = new Map();

        for (const def of categoryDefinitions) {
            if (!categoryMap.has(def.slug)) {
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
        let itemCount = 0;
        for (const def of categoryDefinitions) {
            const items = menu[def.key];
            if (!items) continue;

            const category = categoryMap.get(def.slug);

            for (const item of items) {
                const basePrice = item.price || (item.sizes ? Object.values(item.sizes)[0] : 0);

                let sizesArray = [];
                if (item.sizes) {
                    sizesArray = Object.entries(item.sizes).map(([name, price]) => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        price: price,
                        description: ''
                    }));
                }

                let extrasArray = [];
                if (item.extras) {
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

                const isPopular = item.id === 'PZ001' || item.id === 'PP001' || item.id === 'H001';
                const isFeatured = item.description && item.description.length > 20;

                try {
                    await MenuItem.create({
                        categoryId: category.id,
                        name: item.name,
                        slug: generateSlug(item.name) + '-' + item.id,
                        description: item.description || '',
                        basePrice: basePrice,
                        sizes: sizesArray,
                        extras: extrasArray,
                        ingredients: [],
                        isAvailable: true, // Explicitly set
                        isPopular: isPopular,
                        isFeatured: isFeatured,
                        displayOrder: 0
                    });
                    itemCount++;
                } catch (err) {
                    console.error(`❌ Error importing ${item.name}:`, err.message);
                }
            }
        }

        res.json({ success: true, message: `Menú importado: ${itemCount} platillos creados.` });

    } catch (error) {
        console.error('❌ Error en seed:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
