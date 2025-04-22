// db.js  (PostgreSQL connection + schema)
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('PG connect error:', err.message);
  else console.log('Connected to PostgreSQL. Server time:', res.rows[0].now);
});

/* ── NEW COLUMNS: major, classification ──
   classification is limited by a CHECK constraint */
const createTable = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    university TEXT,
    track TEXT,
    major TEXT,
    classification TEXT, 
    attendance_count INTEGER DEFAULT 0,
    certificateEligible BOOLEAN DEFAULT false
  );
`;
pool.query(createTable)
  .then(() => console.log('Users table created or verified.'))
  .catch(err => console.error('Error creating table:', err.message));

module.exports = pool;
