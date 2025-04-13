// importCsv.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('./db'); // Reuse the same SQLite connection and schema from db.js

// Path to your CSV file (example.csv)
const csvFilePath = path.join(__dirname, 'example.csv');

// This variable will store the next numeric ID to assign for new accounts
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
  let rowCount = 0;
  let errorReport = [];

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  stream.on('data', (row) => {
    // Pause the stream so that we process one row at a time
    stream.pause();
    rowCount++;

    // Validate required fields: name and email must exist
    if (!row.name || !row.email) {
      console.warn(`Row ${rowCount}: Missing required fields. Skipping row.`);
      errorReport.push(`Row ${rowCount}: Missing required fields.`);
      stream.resume();
      return; // Skip this row
    }

    const { name, email, university, track } = row;
    // Convert attendance_count to a number, default to 1 if not provided
    const additionalAttendance = parseInt(row.attendance_count, 10) || 1;

    // Check if the user already exists by email
    db.get('SELECT id, attendance_count FROM users WHERE email = ?', [email], (err, existingUser) => {
      if (err) {
        console.error(`Row ${rowCount}: DB error during lookup for ${email}: ${err.message}`);
        errorReport.push(`Row ${rowCount} (${email}): ${err.message}`);
        stream.resume();
        return;
      }
      if (existingUser) {
        // If the user exists, update the attendance_count by adding additionalAttendance
        const updateQuery = `
          UPDATE users
          SET attendance_count = attendance_count + ?
          WHERE email = ?
        `;
        db.run(updateQuery, [additionalAttendance, email], (err) => {
          if (err) {
            console.error(`Error updating row ${rowCount} (email: ${email}): ${err.message}`);
            errorReport.push(`Row ${rowCount} (${email}): ${err.message}`);
          } else {
            console.log(`Updated user: ${name} (${email}) with +${additionalAttendance} attendance.`);
          }
          stream.resume();
        });
      } else {
        // If the user does not exist, insert a new record with the new sequential ID
        const newId = `USR-${nextId}`;
        const insertQuery = `
          INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertQuery, [newId, name, email, university, track || null, additionalAttendance, false], (err) => {
          if (err) {
            console.error(`Error inserting row ${rowCount} (email: ${email}): ${err.message}`);
            errorReport.push(`Row ${rowCount} (${email}): ${err.message}`);
          } else {
            console.log(`Inserted new user: ${name} (${email}) with ID: ${newId}`);
            nextId++; // Increment nextId only for new insertions
          }
          stream.resume();
        });
      }
    });
  });

  stream.on('end', () => {
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
  });

  stream.on('error', (err) => {
    console.error('Error reading CSV file:', err.message);
  });
});
