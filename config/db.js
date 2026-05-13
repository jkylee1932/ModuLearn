const { Pool } = require('pg');
require('dotenv').config();

// Mas mainam gamitin ang connectionString para sa Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Importante: Pinapayagan nito ang secure connection sa Render
    }
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
