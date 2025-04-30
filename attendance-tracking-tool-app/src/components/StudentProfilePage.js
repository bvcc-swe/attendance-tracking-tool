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
  // List of all schools in the BVCC curiculum program 
  const allSchools = [
  "North Carolina A&T University",
  "Morgan State University",
  "Howard University",
  "Florida A & M University",
  "Spellman College",
  "Morehouse College",
  "Tennessee State University",
  "Clark Atlanta University",
  "Wellesley College",  
];
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
    // Helper function to normalize school names for comparison
  const normalizeSchoolName = (name) => {
    if (!name) return "";
    return name.toLowerCase()
      .replace(/\s+/g, ' ')  // Normalize spaces
      .trim();
  };
  // Helper function to find the official school name regardless of casing or minor variations
  const findOfficialSchoolName = (studentSchool) => {
    const normalizedStudentSchool = normalizeSchoolName(studentSchool);
    
    // Handle common abbreviations
    const abbreviations = {
      "nc a&t": "North Carolina A&T University",
      "morgan": "Morgan State University",
      "morgan state": "Morgan State University",
      "howard": "Howard University",
      "famu": "Florida A & M University",
      "florida a&m": "Florida A & M University",
      "spellman": "Spellman College",
      "morehouse": "Morehouse College",
      "tsu": "Tennessee State University",
      "tennessee state": "Tennessee State University",
      "clark atlanta": "Clark Atlanta University",
      "cau": "Clark Atlanta University"
    };
    // Check if it's a direct abbreviation
    if (abbreviations[normalizedStudentSchool]) {
      return abbreviations[normalizedStudentSchool];
    }
    
    // Try to match with official school names ignoring case
    for (const school of allSchools) {
      if (normalizeSchoolName(school).includes(normalizedStudentSchool) || 
          normalizedStudentSchool.includes(normalizeSchoolName(school))) {
        return school;
      }
    }
    
    // If no match, return the original school name
    return studentSchool;
  };

    // Group students by school - this includes all schools with their students (if any)
  const groupStudentsBySchool = () => {
    // Initialize with all schools having empty arrays
    const groupedBySchool = {};
    allSchools.forEach(school => {
      groupedBySchool[school] = [];
    });
    
    // Add students to their respective schools
    sortedStudents.forEach(student => {
      const officialSchoolName = findOfficialSchoolName(student.university);
      // If the student's university is in our list, add them
      if (groupedBySchool.hasOwnProperty(officialSchoolName)) {
        // Clone the student and update the university name to the official one
        const normalizedStudent = {
          ...student,
          displayUniversity: student.university, // Keep original for display if needed
          university: officialSchoolName // Use the official name for grouping
        };
        groupedBySchool[officialSchoolName].push(normalizedStudent);
      } else {
        // Handle students from schools not in our predefined list
        if (!groupedBySchool["Other Schools"]) {
          groupedBySchool["Other Schools"] = [];
        }
        groupedBySchool["Other Schools"].push(student);
      }
    });
    
    return groupedBySchool;
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

      {/* Render Grouped by School if sorted by school */}
      {sortOption === "school" ? (
        Object.entries(groupStudentsBySchool()).map(([university, students]) => (
          <div key={university} style={{ marginBottom: "30px", textAlign: "left" }}>
            <h2>{university}</h2>
            {students.length > 0 ? (
              <div className="profile-container">
                {students.map((student, index) => (
                  <UserProfileCard
                    key={index}
                    name={student.name}
                    email={student.email}
                    university={student.university}
                    major={student.major}
                    classification={student.classification}
                    track={student.track}
                    attendanceCount={student.attendance_count}
                    isEligibleForCertificate={student.attendance_count >= 7}
                  />
                ))}
              </div>
            ) : (
              <p>No students from this school.</p>
            )}
          </div>
        ))
      ) : (
        // Default Rendering Sorted Students on the page
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
      )}
    </div> // closing of stlye div
  );
};

export default StudentProfilePage;