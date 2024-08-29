const { Pool } = require('pg');

// Create a pool for the default database to run initial commands
const defaultPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'karun',
    port: 5432,
});

// Function to create the new database and tables
const createDatabaseAndTables = async () => {
    // Create a pool for the new database
    const newPool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'imagedb',
        password: 'karun',
        port: 5432,
    });

    try {
        await newPool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        await newPool.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) NOT NULL
            );
        `);

        await newPool.query(`
            CREATE TABLE IF NOT EXISTS images (
                id SERIAL PRIMARY KEY,
                request_id UUID REFERENCES requests(id),
                original_image_url TEXT NOT NULL,
                processed_image_url TEXT,
                status VARCHAR(50) NOT NULL
            );
        `);

        console.log('Database and tables created successfully.');
    } catch (err) {
        console.error('Error setting up the database:', err);
    } finally {
        newPool.end(); 
    }
};

(async () => {
    try {
        // Drop the 'imagedb' database if it exists
        await defaultPool.query('DROP DATABASE IF EXISTS imagedb;');
        await defaultPool.query('CREATE DATABASE imagedb;');

        console.log('Database "imagedb" created successfully.');

        await defaultPool.end();

        await createDatabaseAndTables();
    } catch (err) {
        console.error('Error setting up the database:', err);
        await defaultPool.end(); 
    }
})();
