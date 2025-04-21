// testQueries.js
const { getStudentViews } = require('./queries');

getStudentViews()
  .then(views => {
    console.log("Student Views:");
    console.log(JSON.stringify(views, null, 2));
  })
  .catch(err => {
    console.error("Error retrieving student views:", err);
  });
