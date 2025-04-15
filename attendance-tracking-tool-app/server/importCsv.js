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

// Function to store the parsed student data into the database using the array of objects
async function storeStudents(studentsArray) {
  let nextId = await getNextId();
  for (const student of studentsArray) {
    try {
      // Check if user already exists by email (emails are already normalized to lowercase)
      const existing = await db.query('SELECT id, attendance_count FROM users WHERE email = $1', [student.email]);
      if (existing.rows.length > 0) {
        // If user exists, update the attendance count
        await db.query('UPDATE users SET attendance_count = attendance_count + $1 WHERE email = $2', [student.attendance_count, student.email]);
        console.log(`Updated user: ${student.name} (${student.email}) with +${student.attendance_count} attendance.`);
      } else {
        // Insert a new record with the next sequential ID
        const newId = `USR-${nextId}`;
        const insertQuery = `
          INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await db.query(insertQuery, [newId, student.name, student.email, student.university, student.track, student.attendance_count, false]);
        console.log(`Inserted new user: ${student.name} (${student.email}) with ID: ${newId}`);
        nextId++;
      }
    } catch (err) {
      console.error(`Error processing student (${student.email}): ${err.message}`);
    }
  }
}

// Main function to parse CSV into an array and store the data
async function processCSV() {
  let rowCount = 0;
  let parsedStudents = []; // Array to hold all parsed student objects

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  // Parse each row and push into the array
  for await (const row of stream) {
    rowCount++;
    if (!row.name || !row.email) {
      console.warn(`Row ${rowCount}: Missing required fields. Skipping row.`);
      continue;
    }

    // Create a student object with normalized data
    const student = {
      name: row.name,
      email: row.email.toLowerCase(),
      university: row.university ? row.university.toLowerCase() : null,
      track: row.track ? row.track.toLowerCase() : null,
      attendance_count: parseInt(row.attendance_count, 10) || 1
    };

    parsedStudents.push(student);
  }

  console.log(`CSV file parsed successfully! Total rows processed: ${rowCount}`);
  console.log("Parsed data array:", parsedStudents);

  // Now pass the array of student objects to the function that stores them in the database
  await storeStudents(parsedStudents);
}

// Run the process
processCSV().catch(err => {
  console.error('Error processing CSV file:', err.message);
});
