require('dotenv').config();
const { Client } = require('pg');

const config = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default DB first
};

const createDb = async () => {
    const client = new Client(config);
    const dbName = process.env.DB_NAME || 'parmesana_db';

    try {
        await client.connect();
        console.log('🔌 Conectado a Postgres para crear base de datos...');

        // Check if database exists
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (res.rowCount === 0) {
            console.log(`✨ Creando base de datos "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log('✅ Base de datos creada exitosamente!');
        } else {
            console.log(`ℹ️ La base de datos "${dbName}" ya existe.`);
        }
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await client.end();
    }
};

createDb();
