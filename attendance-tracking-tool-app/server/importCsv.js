// server/importCsv.js
const fs   = require('fs');
const csv  = require('csv-parser');
const path = require('path');
const db   = require('./db');          // PostgreSQL pool
require('dotenv').config();

const csvFilePath = path.join(__dirname, 'example.csv');

/* ─────────── helpers ─────────── */
async function getNextId() {
  try {
    const { rows } = await db.query(
      'SELECT MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)) AS maxId FROM users'
    );
    return rows[0].maxid ? rows[0].maxid + 1 : 10000;
  } catch (err) {
    console.error('Error fetching max ID:', err.message);
    return 10000;
  }
}

/* ─────────── main insert/update routine ─────────── */
async function storeStudents(studentsArray) {
  let nextId = await getNextId();

  for (const raw of studentsArray) {
    /* tolerate name OR fullName */
    const name  = raw.name || raw.fullName;
    const email = raw.email ? raw.email.toLowerCase() : null;

    if (!name || !email) {
      console.warn('Skipping row missing name or email:', raw);
      continue;                         // required fields missing
    }

    /* normalize other fields */
    const student = {
      name,
      email,
      university    : raw.university?.toLowerCase() || null,
      track         : raw.track?.toLowerCase()      || null,
      major         : raw.major?.toLowerCase()      || null,
      classification: raw.classification?.toLowerCase() || null,
      attendance    : Number(raw.attendance_count) || 1
    };

    try {
      const dup = await db.query('SELECT id, attendance_count FROM users WHERE email = $1', [student.email]);

      if (dup.rows.length) {
        /* update attendance */
        await db.query(
          'UPDATE users SET attendance_count = attendance_count + $1 WHERE email = $2',
          [student.attendance, student.email]
        );
        console.log(`Updated ${student.email} (+${student.attendance})`);
      } else {
        /* insert new row */
        const id = `USR-${nextId++}`;
        await db.query(
          `INSERT INTO users
             (id, name, email, university, track, major, classification, attendance_count, certificateEligible)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            id, student.name, student.email, student.university,
            student.track, student.major, student.classification,
            student.attendance, false
          ]
        );
        console.log(`Inserted new user: ${student.email} → ${id}`);
      }
    } catch (err) {
      console.error(`Error processing ${student.email}:`, err.message);
    }
  }
}

/* ─────────── optional CLI parser (local CSV) ─────────── */
async function processCSV() {
  let rowCount = 0;
  const parsed = [];

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  for await (const row of stream) {
    rowCount++;
    const name = row.name || row.fullName;
    if (!name || !row.email) {
      console.warn(`Row ${rowCount} missing name/email — skipped.`);
      continue;
    }

    parsed.push({
      name,
      email          : row.email.toLowerCase(),
      university     : row.university?.toLowerCase() || null,
      track          : row.track?.toLowerCase()      || null,
      major          : row.major?.toLowerCase()      || null,
      classification : row.classification?.toLowerCase() || null,
      attendance_count: parseInt(row.attendance_count, 10) || 1
    });
  }

  console.log(`Parsed ${parsed.length}/${rowCount} CSV rows`);
  await storeStudents(parsed);
}

/* If run directly: node importCsv.js */
if (require.main === module) {
  processCSV().catch(err => console.error('CSV load error:', err.message));
}

module.exports = { storeStudents };
