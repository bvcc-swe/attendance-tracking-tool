//This is where the student profile card will be displayed for each student
import React from "react";
import UserProfileCard from "./UserProfileCard.tsx"; 

const StudentProfile = () => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      <UserProfileCard /> {/* Simply rendering the component */}
    </div>
  );
};

export default StudentProfile;
