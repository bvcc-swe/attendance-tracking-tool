// importCsv.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('./db');  // Reuse the same SQLite connection logic from db.js

function generateId() {
  return `USR-${Math.floor(10000 + Math.random() * 90000)}`;
}

// Path to your CSV file (example.csv)
const csvFilePath = path.join(__dirname, 'example.csv');

// Create a read stream for the CSV, then pipe to csv-parser
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // row => { name: '...', email: '...', university: '...', attendance_count: '...' }

    // Generate a unique ID
    const id = generateId();
    const { name, email, university } = row;
    // Convert attendance_count to a number or default to 0
    const attendance_count = parseInt(row.attendance_count, 10) || 0;

    // Insert into the database
    const query = `
    INSERT INTO users (id, name, email, university, attendance_count, certificateEligible)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE
    SET
      name=excluded.name,
      university=excluded.university,
      attendance_count=excluded.attendance_count,
      certificateEligible=excluded.certificateEligible
  `;
  'addition'
    db.run(
      query,
      [id, name, email, university, attendance_count, false],
      (err) => {
        if (err) {
          console.error('Error inserting row:', err.message);
        } else {
          console.log(`Inserted user: ${name} with ID: ${id}`);
        }
      }
    );
  })
  .on('end', () => {
    console.log('CSV file successfully processed!');
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err.message);
  });
