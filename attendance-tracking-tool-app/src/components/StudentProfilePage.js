import React, { useState, } from "react";
import UserProfileCard from "./UserProfileCard"; // Removed .tsx

const StudentProfilePage = ({ students = [] }) => {  
  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for sorting option
  const [sortOption, setSortOption] = useState("");
  // Function to handle search input changes
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
 
  console.log("Received students:", students); //display student array in console if received
  // Filter and sort students
  const sortedStudents = [...students]
    .filter((student) =>
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.track.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "school") return a.university.localeCompare(b.university);
      if (sortOption === "track") return a.track.localeCompare(b.track);
      if (sortOption === "attendance-high-low") return b.attendance_count - a.attendance_count;
      if (sortOption === "attendance-low-high") return a.attendance_count - b.attendance_count;
      return 0;
    });

  // Function to generate dynamic heading for the header (Student Profiles) based on filtering options
  const generateHeading = () => {
    if (!searchQuery && !sortOption) {  //Show default of "Student Profiles" if nothing is search or sorted.
      return "Student Profiles";
    }
    
    let heading = "Student Profiles";
    
    if (searchQuery) {
      heading = `Students matching "${searchQuery}"`;  //If searching, display, "students matching, *userinput*
    }
    
    if (sortOption) {
      const sortDescriptions = {
        "school": "Sorted by School",
        "track": "Sorted by Track",
        "attendance-high-low": "Highest Attendance First",
        "attendance-low-high": "Lowest Attendance First"
      };  //handles display of dynamic header when sorting
      
      if (searchQuery) {
        heading += ` - ${sortDescriptions[sortOption]}`;
      } else {
        heading = `Student Profiles - ${sortDescriptions[sortOption]}`;
      }
    }
    // Add count of results
    heading += ` (${sortedStudents.length} results)`;  //show the number of results for each search or sort query
    
    return heading;
  };
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>{generateHeading()}</h2>

      {/* Search Bar Styling */}
      <input
        type="text"
        placeholder="Search by school or track..."
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: "10px",
          width: "170px",
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
      <div className="profile-container">
        {sortedStudents.map((student, index) => (
          <UserProfileCard
          key={index}
          name={student.name}
          email={student.email}
          university={student.university}
          major={student.major}
          classification={student.classification}
          track={student.track}

          attendanceCount={student.attendance_count}
          isEligibleForCertificate={student.attendance_count >= 7} /> //This determines wether or not they are elligible for the certificate based on

          //if they have an attendance count greater than 7 since the program is a 10 week long program
        ))}
      </div>
    </div>
  );
};

export default StudentProfilePage;