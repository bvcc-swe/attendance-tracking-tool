// testDB.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

async function testDB() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected! Server time is:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await pool.end(); // Close connection
  }
}

testDB();
