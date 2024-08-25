const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
 user: process.env.PGUSER ,
 password: process.env.PGPASSWORD,
 host: process.env.PGHOST,
 port: process.env.PGPORT,
 database: process.env.PGDATABASE,
};

// Create a new PostgreSQL client
const pool = new Pool(dbConfig);

module.exports = pool;