const sqlite3 = require('sqlite3').verbose();

// Connect to (or create) the database file "database.db" in the current folder
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the "users" table if it doesn't exist yet
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      university TEXT,
      track TEXT,
      attendance_count INTEGER DEFAULT 0,
      certificateEligible BOOLEAN DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or verified.');
    }
  });
});

module.exports = db;
