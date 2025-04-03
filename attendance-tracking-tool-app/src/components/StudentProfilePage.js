//This is where the student profile card will be displayed for each student
import React from "react";
import UserProfileCard from "./UserProfileCard.tsx"; 

const StudentProfile = () => {  //this is the sample data passed into the card
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
  const headerStyle = {
    textAlign: 'center',    // Center text
    color: '#333',          // Dark gray color
    fontSize: '24px',       // Font size
    fontWeight: 'bold',     // Bold text
    marginTop: '20px',      // Top margin
};

  return (
    <div>
      <h2 style={headerStyle}>Student Profiles</h2>
      <UserProfileCard {...student} />
    </div>
  );
};

export default StudentProfile;