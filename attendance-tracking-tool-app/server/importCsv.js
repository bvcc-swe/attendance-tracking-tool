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

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  for await (const row of stream) {
    rowCount++;
    if (!row.name || !row.email) {
      console.warn(`Row ${rowCount}: Missing required fields. Skipping row.`);
      errorReport.push(`Row ${rowCount}: Missing required fields.`);
      continue;
    }

    const { name, email, university, track } = row;
    const additionalAttendance = parseInt(row.attendance_count, 10) || 1;

    try {
      const existing = await db.query('SELECT id, attendance_count FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        // Update the attendance count for existing user
        await db.query('UPDATE users SET attendance_count = attendance_count + $1 WHERE email = $2', [additionalAttendance, email]);
        console.log(`Updated user: ${name} (${email}) with +${additionalAttendance} attendance.`);
      } else {
        const newId = `USR-${nextId}`;
        const insertQuery = `
          INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await db.query(insertQuery, [newId, name, email, university, track || null, additionalAttendance, false]);
        console.log(`Inserted new user: ${name} (${email}) with ID: ${newId}`);
        nextId++; // Increment nextId only for new insertions
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
