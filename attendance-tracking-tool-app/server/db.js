// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('Connected to PostgreSQL. Server time:', res.rows[0].now);
  }
});

// Create the "users" table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    university TEXT,
    track TEXT,
    attendance_count INTEGER DEFAULT 0,
    certificateEligible BOOLEAN DEFAULT false
  );
`;
pool.query(createTableQuery)
  .then(() => console.log('Users table created or verified.'))
  .catch(err => console.error('Error creating users table:', err.message));

module.exports = pool;
