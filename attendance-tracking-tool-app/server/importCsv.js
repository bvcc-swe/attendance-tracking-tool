const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('./db'); // Reuse the SQLite connection and schema from db.js

// Path to your CSV file (example.csv)
const csvFilePath = path.join(__dirname, 'example.csv');

// This variable will store the next numeric ID to assign
let nextId;

// Function to initialize nextId by querying the current maximum in the users table
function initializeNextId(callback) {
  const queryMax = "SELECT MAX(CAST(SUBSTR(id, 5) AS INTEGER)) as maxId FROM users";
  db.get(queryMax, (err, row) => {
    if (err) {
      console.error("Error fetching max ID:", err.message);
      nextId = 10000; // Fallback starting value
    } else {
      nextId = (row && row.maxId) ? row.maxId + 1 : 10000;
    }
    callback();
  });
}

// Initialize the nextId value, then process the CSV file
initializeNextId(() => {
  rowCount = 0;
  let errorReport = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      rowCount++;

      // Validate required fields: name and email must exist
      if (!row.name || !row.email) {
        console.warn(`Row ${rowCount}: Missing required fields. Skipping row.`);
        errorReport.push(`Row ${rowCount}: Missing required fields.`);
        return; // Skip this row
      }

      // Generate a sequential ID using the initialized nextId
      const id = `USR-${nextId}`;
      nextId++; // Increment for the next valid row

      const { name, email, university } = row;
      // This will convert attendance_count to a number, or default to 0 if it is invalid
      const attendance_count = parseInt(row.attendance_count, 10) || 0;

      // SQL query to insert the user. Uses ON CONFLICT to update if the email already exists.
      const query = `
        INSERT INTO users (id, name, email, university, attendance_count, certificateEligible)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE
        SET name = excluded.name,
            university = excluded.university,
            attendance_count = excluded.attendance_count,
            certificateEligible = excluded.certificateEligible
      `;
      db.run(query, [id, name, email, university, attendance_count, false], (err) => {
        if (err) {
          console.error(`Error inserting row ${rowCount} (email: ${email}): ${err.message}`);
          errorReport.push(`Row ${rowCount} (email: ${email}): ${err.message}`);
        } else {
          console.log(`Inserted/Updated user: ${name} with ID: ${id}`);
        }
      });
    })
    .on('end', () => {
      if (rowCount === 0) {
        console.error('Error: CSV file is empty or no valid rows found.');
      } else {
        console.log(`CSV file successfully processed! Total rows processed: ${rowCount}`);
        if (errorReport.length > 0) {
          console.warn('Some rows encountered errors:');
          errorReport.forEach((msg) => console.warn(msg));
        } else {
          console.log('All rows processed successfully.');
        }
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err.message);
    });
});
