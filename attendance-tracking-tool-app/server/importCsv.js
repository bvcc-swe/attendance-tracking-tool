// importCsv.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('./db'); // Reuse the SQLite connection and schema from db.js

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

      // Generate a sequential ID for new accounts using the initialized nextId
      // This is used only if the account does not exist.
      const newId = `USR-${nextId}`;
      // We'll increment nextId only when inserting a new account.
      // For existing users, we update the attendance count.

      const { name, email, university, track } = row;
      // Convert attendance_count to a number, or default to 1 if it is invalid
      // (Assuming each row represents 1 session, or it can be a numeric value from the CSV)
      const additionalAttendance = parseInt(row.attendance_count, 10) || 1;

      // SQL query to insert the user.
      // If a conflict occurs on email, update:
      // - attendance_count by adding the new attendance value
      // - other fields (name, university) get updated as well
      const query = `
        INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE
        SET name = excluded.name,
            university = excluded.university,
            track = excluded.track,
            attendance_count = users.attendance_count + excluded.attendance_count,
            certificateEligible = excluded.certificateEligible
      `;
      db.run(query, [newId, name, email, university, track, additionalAttendance, false], (err) => {
        if (err) {
          console.error(`Error inserting row ${rowCount} (email: ${email}): ${err.message}`);
          errorReport.push(`Row ${rowCount} (email: ${email}): ${err.message}`);
        } else {
          console.log(`Processed user: ${name} - ${email}`);
          // Only increment nextId if a new row was actually inserted.
          // If the user already existed, their record is updated and nextId remains the same.
          // Since ON CONFLICT doesn't tell us if it was an insert or an update,
          // one approach is to assume that if it's a new email, nextId is used.
          // (If needed, you could add extra logic to verify insertion vs update.)
          // For simplicity, if you assume that each CSV row for a new user is unique,
          // then increment nextId after every insertion attempt.
          nextId++;
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
