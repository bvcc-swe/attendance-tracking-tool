// server/importCsv.js
const fs   = require('fs');
const csv  = require('csv-parser');
const path = require('path');
const db   = require('./db');        // ← PostgreSQL pool
require('dotenv').config();

/* If you still want to test with a local CSV, keep this path.
   It is NOT used when the front-end POSTs /upload-csv.          */
const csvFilePath = path.join(__dirname, 'example.csv');

/* ───────────────── helpers ───────────────── */
async function getNextId() {
  try {
    const { rows } = await db.query(
      'SELECT MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)) AS max FROM users'
    );
    return rows[0].max ? rows[0].max + 1 : 10000;
  } catch (e) {
    console.error('Error fetching max ID:', e.message);
    return 10000;
  }
}

/* ───────────────── core routine ───────────────── */
async function storeStudents(students) {
  let nextId = await getNextId();

  for (const raw of students) {
    /* ── tolerate different header cases ── */
    const name  =
      raw.name  ?? raw.Name  ?? raw.fullName ?? raw.FullName ?? null;
    const email =
      (raw.email ?? raw.Email ?? '').toLowerCase();

    if (!name || !email) {
      console.warn('Skipping row missing name/email:', raw);
      continue;
    }

    /* normalise the rest */
    const student = {
      name,
      email,
      university    : (raw.university     ?? raw.University     ?? '').toLowerCase() || null,
      track         : (raw.track          ?? raw.Track          ?? '').toLowerCase() || null,
      major         : (raw.major          ?? raw.Major          ?? '').toLowerCase() || null,
      classification: (raw.classification ?? raw.Classification ?? '').toLowerCase() || null,
      attendance    : Number(
                        raw.attendance_count ??
                        raw['Attendance Count'] ??
                        raw.Attendance ??
                        1
                      ) || 1
    };

    try {
      /* duplicate check */
      const dup = await db.query(
        'SELECT attendance_count FROM users WHERE email = $1',
        [student.email]
      );

      if (dup.rows.length) {
        /* update attendance */
        await db.query(
          'UPDATE users SET attendance_count = attendance_count + $1 WHERE email = $2',
          [student.attendance, student.email]
        );
        console.log(`Updated ${student.email} (+${student.attendance})`);
      } else {
        /* insert new */
        const id = `USR-${nextId++}`;
        await db.query(
          `INSERT INTO users
             (id, name, email, university, track, major, classification,
              attendance_count, certificateEligible)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            id, student.name, student.email, student.university,
            student.track, student.major, student.classification,
            student.attendance, false
          ]
        );
        console.log(`Inserted ${student.email} → ${id}`);
      }
    } catch (e) {
      console.error(`DB error for ${student.email}:`, e.message);
    }
  }
}

/* ───────────────── optional CLI parser ─────────────────
   Run “node server/importCsv.js” to load example.csv locally. */
async function processCSV() {
  const parsed = [];
  let row = 0;

  const stream = fs.createReadStream(csvFilePath).pipe(csv());
  for await (const r of stream) {
    row++;
    const name  = r.name ?? r.Name;
    const email = r.email ?? r.Email;
    if (!name || !email) {
      console.warn(`Row ${row} skipped (missing name/email)`);
      continue;
    }
    parsed.push(r);
  }
  console.log(`Parsed ${parsed.length}/${row} rows from CSV`);
  await storeStudents(parsed);
}

if (require.main === module) {
  processCSV().catch(e => console.error('CSV load error:', e.message));
}

/* Export for the /upload-csv route */
module.exports = { storeStudents };
