require('dotenv').config();
const { Category, MenuItem } = require('./src/models');
const { testConnection } = require('./src/config/database');

const checkContent = async () => {
    try {
        await testConnection();

        const categoryCount = await Category.count();
        const itemCount = await MenuItem.count();

        console.log('📊 Estado de la Base de Datos:');
        console.log(`   - Categorías: ${categoryCount}`);
        console.log(`   - Items del Menú: ${itemCount}`);

        if (categoryCount === 0 || itemCount === 0) {
            console.log('⚠️  La base de datos parece estar vacía.');
        } else {
            console.log('✅  La base de datos tiene datos.');
        }
    } catch (error) {
        console.error('❌ Error al consultar la base de datos:', error);
    } finally {
        process.exit(0);
    }
};

checkContent();
