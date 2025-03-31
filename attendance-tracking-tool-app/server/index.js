const express = require('express');
const cors = require('cors');
const db = require('./db'); // This file sets up the SQLite connection and schema

const app = express();

// Enable CORS so your front end can call this API
app.use(cors());
// Parses the JSON bodies that are ciming in
app.use(express.json());

// Basic test route, make sure everyth workin
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

const { getStudentViews } = require('./queries');

app.get('/student-views', (req, res) => {
  getStudentViews((err, views) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving student views' });
    }
    return res.json(views);
  });
});


// GET /users - This will retrieve all of the users
app.get('/users', (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(rows);
  });
});

// POST /users - Create a new user account
app.post('/users', (req, res) => {
  const { name, email, university, track, attendance_count } = req.body;

  // 1. Validate required fields, Needs both (name, email) in order for account creation
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields: name and email are required.' });
  }

  // 2. This will check if the email already exists
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, existingUser) => {
    if (err) {
      console.error('Database error during email check:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (existingUser) {
      return res.status(400).json({ error: 'Error: Account already created with this email.' });
    }

    // 3. Generate a sequential unique ID
    const queryMax = "SELECT MAX(CAST(SUBSTR(id, 5) AS INTEGER)) as maxId FROM users";
    db.get(queryMax, (err, row) => {
      if (err) {
        console.error('Error fetching max ID:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // If no user exists, start at 10000; otherwise, increment the highest ID by 1.
      const newIdNumber = row && row.maxId ? row.maxId + 1 : 10000;
      const id = `USR-${newIdNumber}`;

      
      const insertQuery = `
        INSERT INTO users (id, name, email, university, track, attendance_count, certificateEligible)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(insertQuery, [id, name, email, university, track, attendance_count || 0, false], function(err) {
        if (err) {
          console.error('Error inserting user:', err.message);
          
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(400).json({ error: 'Error: Account already created with this email.' });
          } else {
            return res.status(500).json({ error: 'Internal server error' });
          }
        }
        return res.status(201).json({
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
      });
    });
  });
});

// Start the server on port 6060 (or the port defined in your environment)
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
