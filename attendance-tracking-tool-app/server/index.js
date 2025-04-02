// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // PostgreSQL pool
const { getStudentViews } = require('./queries');
require('dotenv').config();

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
  const { name, email, university, track, attendance_count } = req.body;

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
      INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await db.query(insertQuery, [id, name, email, university, track || null, attendance_count || 0, false]);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id,
        name,
        email,
        university,
        track: track || null,
        attendance_count: attendance_count || 0,
        certificateEligible: false
      }
    });
  } catch (err) {
    console.error('Error inserting user:', err.message);
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ error: 'Error: Account already created with this email.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
