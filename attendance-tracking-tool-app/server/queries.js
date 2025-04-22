// server/queries.js
const db = require('./db');

/* ─────────── basic helpers ─────────── */
async function getAllStudents() {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
}

async function getStudentsByTrack(track) {
  const result = await db.query('SELECT * FROM users WHERE track = $1', [track]);
  return result.rows;
}

async function getStudentsByUniversity(university) {
  const result = await db.query('SELECT * FROM users WHERE university = $1', [university]);
  return result.rows;
}

async function getStudentsByClassification(cls) {
  const result = await db.query('SELECT * FROM users WHERE classification = $1', [cls]);
  return result.rows;
}

async function getStudentsByMajor(major) {
  const result = await db.query('SELECT * FROM users WHERE major = $1', [major]);
  return result.rows;
}

async function getStudentsByAttendance(order = 'desc') {
  const sort = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const result = await db.query(`SELECT * FROM users ORDER BY attendance_count ${sort}`);
  return result.rows;
}

/* ─────────── aggregated view ─────────── */
async function getStudentViews() {
  const views = {};

  // 1. all students
  views.allStudents = await getAllStudents();

  // 2. by track
  const tracks = [
    'venture capital',
    'software engineering',
    'product management',
    'ux design',
    'entrepreneurship'
  ];
  views.byTrack = {};
  for (const t of tracks) {
    views.byTrack[t] = await getStudentsByTrack(t);
  }

  // 3. by university
  const universities = ['famu', 'auc', 'howard'];
  views.byUniversity = {};
  for (const uni of universities) {
    views.byUniversity[uni] = await getStudentsByUniversity(uni);
  }

  // 4. by classification
  const classes = ['freshman', 'sophomore', 'junior', 'senior'];
  views.byClassification = {};
  for (const c of classes) {
    views.byClassification[c] = await getStudentsByClassification(c);
  }

  // 5. by major
  const majors = ['computer science', 'business', 'finance', 'data science'];
  views.byMajor = {};
  for (const m of majors) {
    views.byMajor[m] = await getStudentsByMajor(m);
  }

  // 6. attendance order
  views.attendanceOrder = {
    desc: await getStudentsByAttendance('desc'),
    asc : await getStudentsByAttendance('asc')
  };

  return views;
}

/* ─────────── exports ─────────── */
module.exports = {
  getAllStudents,
  getStudentsByTrack,
  getStudentsByUniversity,
  getStudentsByClassification,
  getStudentsByMajor,
  getStudentsByAttendance,
  getStudentViews
};
