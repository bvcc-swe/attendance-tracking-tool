const { getStudentViews } = require('./queries');

getStudentViews((err, views) => {
  if (err) {
    console.error("Error retrieving student views:", err);
  } else {
    console.log("Student Views:");
    console.log(JSON.stringify(views, null, 2));
  }
});
