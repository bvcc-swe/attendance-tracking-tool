// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // PostgreSQL pool
const { getStudentViews } = require('./queries');
require('dotenv').config();

const { storeStudents } = require('./importCsv');
console.log("storeStudents:", storeStudents);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.get('/student-views', async (req, res) => {
  try {
    const views = await getStudentViews();
    res.json(views);
  } catch (err) {
    console.error('Error retrieving student views:', err.message);
    res.status(500).json({ error: 'Error retrieving student views' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users', async (req, res) => {
  // Convert email (and other fields if desired) to lowercase
  const name = req.body.name; // You may also choose to lowercase names if needed
  const email = req.body.email.toLowerCase();
  const university = req.body.university ? req.body.university.toLowerCase() : null;
  const track = req.body.track ? req.body.track.toLowerCase() : null;
  const major = req.body.major ? req.body.major.toLowerCase() : null;
  const classification = req.body.classification ? req.body.classification.toLowerCase() : null;
  const attendance_count = req.body.attendance_count;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields: name and email are required.' });
  }

  try {
    const existingResult = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Error: Account already created with this email.' });
    }

    const maxResult = await db.query("SELECT MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)) as maxId FROM users");
    const newIdNumber = maxResult.rows[0].maxid ? maxResult.rows[0].maxid + 1 : 10000;
    const id = `USR-${newIdNumber}`;

    const insertQuery = `
      INSERT INTO users (id, name, email, university, track, major, classification, attendance_count, certificateEligible)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await db.query(insertQuery, [id, name, email, university, track, major, classification, attendance_count || 0, false]);
    res.status(201).json({
      message: 'User created successfully',
      user: { id, name, email, university, track, major, classification, attendance_count: attendance_count || 0, certificateEligible: false }
    });
  } catch (err) {
    console.error('Error inserting user:', err.message);
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ error: 'Error: Account already created with this email.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/upload-csv', async (req, res) => {
  try {
    const students = req.body.students; // Expecting the front end to send an object { students: [...] }
    if (!Array.isArray(students)) {
      return res.status(400).send("Invalid data: 'students' must be an array.");
    }

    // Call the function that processes and stores the array in the database
    await storeStudents(students);
    res.status(200).send("Data stored successfully");
  } catch (error) {
    console.error("Error in /upload-csv:", error.message);
    res.status(500).send("Error storing data: " + error.message);
  }
});



const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
