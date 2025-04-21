import React, { useState } from "react";
import UserProfileCard from "./UserProfileCard"; // Removed .tsx

const StudentProfile = () => {  
  // Sample student data
  const students = [
    {
      name: "Stephanie",
      email: "steph@example.com",
      university: "Morgan State University",
      major: "Computer Science",
      classification: "Freshman",
      track: "Software Engineering",
      attendanceCount: 5,
      certificateEligibility: "Eligible",
    },
    {
      name: "David",
      email: "david@example.com",
      university: "Howard University",
      major: "Cybersecurity",
      classification: "Sophomore",
      track: "Network Security",
      attendanceCount: 8,
      certificateEligibility: "Eligible",
    },
    {
      name: "Olivia",
      email: "olivia@example.com",
      university: "North Carolina A&T University", // Fixed spacing
      major: "Data Science", // Fixed typo
      classification: "Junior",
      track: "Software Engineering",
      attendanceCount: 10,
      certificateEligibility: "Eligible",
    }
  ];

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // State for sorting option
  const [sortOption, setSortOption] = useState("");

  // Function to handle search input changes
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter and sort students
  const sortedStudents = [...students]
    .filter((student) =>
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.track.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "school") return a.university.localeCompare(b.university);
      if (sortOption === "track") return a.track.localeCompare(b.track);
      if (sortOption === "attendance-high-low") return b.attendanceCount - a.attendanceCount;
      if (sortOption === "attendance-low-high") return a.attendanceCount - b.attendanceCount;
      return 0;
    });

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>Student Profiles</h2>

      {/* Search Bar Styling */}
      <input
        type="text"
        placeholder="Search by school or track..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: "8px",
          margin: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Sorting Dropdown */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{
          padding: "8px",
          margin: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Sort by...</option>
        <option value="school">School</option>
        <option value="track">Track</option>
        <option value="attendance-high-low">Attendance Count (High to Low)</option>
        <option value="attendance-low-high">Attendance Count (Low to High)</option>
      </select>

      {/* Render Sorted Students on the page */}
      <div>
        {sortedStudents.map((student, index) => (
          <UserProfileCard
          key={index}
          name={student.name}
          email={student.email}
          university={student.university}
          major={student.major}
          classification={student.classification}
          track={student.track}
          attendanceCount={student.attendanceCount}
          isEligibleForCertificate={student.attendanceCount >= 7} /> //This determines wether or not they are elligible for the certificate based on
          //if hteyhave an attendance count greater than 7 since the program is a 10 week long program
        ))}
      </div>
    </div>
  );
};

export default StudentProfile;