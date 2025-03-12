const db = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();

// Use CORS so the React app can call our server
app.use(cors());

// Parse JSON bodies from the front end
app.use(express.json());

// A simple GET route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// GET /users - retrieve all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err.message);
        return res.status(500).json({ error: err.message });
      }
      // Return an array of user objects
      return res.json(rows);
    });
  });
  
app.post('/users', (req, res) => {
  // Destructure the fields we expect from the request body
  const { name, email, university, attendance_count } = req.body;

  // Generate a unique ID, e.g., "USR-12345"
  const id = `USR-${Math.floor(10000 + Math.random() * 90000)}`;

  // Default certificateEligible to false if not provided
  const certificateEligible = false;

  // Insert the user into the database
  const query = `
    INSERT INTO users (id, name, email, university, attendance_count, certificateEligible)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(
    query,
    [id, name, email, university, attendance_count || 0, certificateEligible],
    function (err) {
      if (err) {
        console.error('Error inserting user:', err.message);
        return res.status(500).json({ error: err.message });
      }
      // Return success
      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id,
          name,
          email,
          university,
          attendance_count: attendance_count || 0,
          certificateEligible
        }
      });
    }
  );
});



// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
