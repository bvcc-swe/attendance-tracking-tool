// queries.js
const db = require('./db');

// 1. Get all students
function getAllStudents(callback) {
  const sql = "SELECT * FROM users";
  db.all(sql, [], (err, rows) => {
    callback(err, rows);
  });
}

// 2. Get students by track
// (Assumes your users table has a column named 'track'.)
function getStudentsByTrack(track, callback) {
  const sql = "SELECT * FROM users WHERE track = ?";
  db.all(sql, [track], (err, rows) => {
    callback(err, rows);
  });
}

// 3. Get students by university
function getStudentsByUniversity(university, callback) {
  const sql = "SELECT * FROM users WHERE university = ?";
  db.all(sql, [university], (err, rows) => {
    callback(err, rows);
  });
}

// 4. Get students sorted by attendance
// order: 'asc' for least-to-most, 'desc' for most-to-least
function getStudentsByAttendance(order, callback) {
  // Default to descending if order is not 'asc'
  const sortOrder = (order && order.toLowerCase() === 'asc') ? 'ASC' : 'DESC';
  const sql = `SELECT * FROM users ORDER BY attendance_count ${sortOrder}`;
  db.all(sql, [], (err, rows) => {
    callback(err, rows);
  });
}

// A single function to gather all views together
function getStudentViews(callback) {
  const views = {};
  
  getAllStudents((err, all) => {
    if (err) return callback(err);
    views.allStudents = all;
    
    // For the sake of this demo, define the tracks and universities we care about:
    const tracks = ['venture capital', 'software engineering', 'product management', 'ux design', 'entrepreneurship'];
    const universities = ['FAMU', 'AUC', 'HOWARD'];
    
    // Query students by track
    views.byTrack = {};
    let tracksRemaining = tracks.length;
    tracks.forEach((track) => {
      getStudentsByTrack(track, (err, rows) => {
        if (err) return callback(err);
        views.byTrack[track] = rows;
        tracksRemaining--;
        if (tracksRemaining === 0) {
          // After tracks are done, query by university
          views.byUniversity = {};
          let unisRemaining = universities.length;
          universities.forEach((uni) => {
            getStudentsByUniversity(uni, (err, rows) => {
              if (err) return callback(err);
              views.byUniversity[uni] = rows;
              unisRemaining--;
              if (unisRemaining === 0) {
                // Finally, query sorted attendance
                views.attendanceOrder = {};
                getStudentsByAttendance('desc', (err, descRows) => {
                  if (err) return callback(err);
                  views.attendanceOrder.desc = descRows;
                  getStudentsByAttendance('asc', (err, ascRows) => {
                    if (err) return callback(err);
                    views.attendanceOrder.asc = ascRows;
                    // All views are now gathered—return the full object
                    callback(null, views);
                  });
                });
              }
            });
          });
        }
      });
    });
  });
}

module.exports = {
  getAllStudents,
  getStudentsByTrack,
  getStudentsByUniversity,
  getStudentsByAttendance,
  getStudentViews
};
