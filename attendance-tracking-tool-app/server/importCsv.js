// importCsv.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const db = require('./db'); // PostgreSQL pool
require('dotenv').config();

const csvFilePath = path.join(__dirname, 'example.csv');

// Async function to get the next sequential ID
async function getNextId() {
  try {
    const res = await db.query("SELECT MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)) as maxId FROM users");
    const maxId = res.rows[0].maxid;
    return maxId ? maxId + 1 : 10000;
  } catch (err) {
    console.error("Error fetching max ID:", err.message);
    return 10000;
  }
}

async function processCSV() {
  let rowCount = 0;
  let errorReport = [];
  let nextId = await getNextId();

  // Create a stream to read and parse the CSV file
  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  // Process each row sequentially using async iteration
  for await (const row of stream) {
    rowCount++;
    if (!row.name || !row.email) {
      console.warn(`Row ${rowCount}: Missing required fields. Skipping row.`);
      errorReport.push(`Row ${rowCount}: Missing required fields.`);
      continue;
    }

    // Convert inputs to lowercase to avoid casing issues
    const name = row.name;
    const email = row.email.toLowerCase();
    const university = row.university ? row.university.toLowerCase() : null;
    const track = row.track ? row.track.toLowerCase() : null;
    const additionalAttendance = parseInt(row.attendance_count, 10) || 1;

    try {
      // Check if user already exists by email
      const existing = await db.query('SELECT id, attendance_count FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        // If exists, update attendance count
        await db.query('UPDATE users SET attendance_count = attendance_count + $1 WHERE email = $2', [additionalAttendance, email]);
        console.log(`Updated user: ${name} (${email}) with +${additionalAttendance} attendance.`);
      } else {
        // If not, insert new record with sequential ID
        const newId = `USR-${nextId}`;
        const insertQuery = `
          INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await db.query(insertQuery, [newId, name, email, university, track || null, additionalAttendance, false]);
        console.log(`Inserted new user: ${name} (${email}) with ID: ${newId}`);
        nextId++; // Increment nextId for the next new record only
      }
    } catch (err) {
      console.error(`Error processing row ${rowCount} (email: ${email}): ${err.message}`);
      errorReport.push(`Row ${rowCount} (${email}): ${err.message}`);
    }
  }

  if (rowCount === 0) {
    console.error('Error: CSV file is empty or no valid rows found.');
  } else {
    console.log(`CSV file successfully processed! Total rows processed: ${rowCount}`);
    if (errorReport.length > 0) {
      console.warn('Some rows encountered errors:');
      errorReport.forEach(msg => console.warn(msg));
    } else {
      console.log('All rows processed successfully.');
    }
  }
}

processCSV().catch(err => {
  console.error('Error processing CSV file:', err.message);
});
