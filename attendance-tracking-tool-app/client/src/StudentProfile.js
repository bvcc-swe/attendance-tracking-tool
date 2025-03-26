//This is where the student profile card will be displayed for each student
import React from "react";
import UserProfileCard from "../UserProfileCard"; 

const StudentProfile = () => {
  // Sample student data
  const student = {
    name: "Stephanie",
    email: "steph@example.com",
    university: "Morgan State University",
    major: "Computer Science",
    classification: "Freshman",
    track: "Software Engineering",
    attendanceCount: 5,
    certificateEligibility: "Eligible"
  };

  return (
    <div>
      <h2>Student Profile</h2>
      <UserProfileCard {...student} />
    </div>
  );
};

export default StudentProfile;