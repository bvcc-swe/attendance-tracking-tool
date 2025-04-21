// queries.js
const db = require('./db');

async function getAllStudents() {
  const sql = "SELECT * FROM users";
  const result = await db.query(sql);
  return result.rows;
}

async function getStudentsByTrack(track) {
  const sql = "SELECT * FROM users WHERE track = $1";
  const result = await db.query(sql, [track]);
  return result.rows;
}

async function getStudentsByUniversity(university) {
  const sql = "SELECT * FROM users WHERE university = $1";
  const result = await db.query(sql, [university]);
  return result.rows;
}

async function getStudentsByAttendance(order) {
  const sortOrder = (order && order.toLowerCase() === 'asc') ? 'ASC' : 'DESC';
  const sql = `SELECT * FROM users ORDER BY attendance_count ${sortOrder}`;
  const result = await db.query(sql);
  return result.rows;
}

async function getStudentViews() {
  const views = {};
  views.allStudents = await getAllStudents();

  // Define the tracks and universities for filtering
  const tracks = ['venture capital', 'software engineering', 'product management', 'ux design', 'entrepreneurship'];
  const universities = ['FAMU', 'AUC', 'HOWARD'];

  views.byTrack = {};
  for (const track of tracks) {
    views.byTrack[track] = await getStudentsByTrack(track);
  }

  views.byUniversity = {};
  for (const uni of universities) {
    views.byUniversity[uni] = await getStudentsByUniversity(uni);
  }

  views.attendanceOrder = {};
  views.attendanceOrder.desc = await getStudentsByAttendance('desc');
  views.attendanceOrder.asc = await getStudentsByAttendance('asc');

  return views;
}

module.exports = {
  getAllStudents,
  getStudentsByTrack,
  getStudentsByUniversity,
  getStudentsByAttendance,
  getStudentViews
};
