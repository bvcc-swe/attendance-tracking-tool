import UserProfileCard from "../components/UserProfileCard";
import React, { useState, useEffect } from "react";


const StudentProfilePage = () => {
  // Dummy Data (this will later be replaced with actual data from API or state)
  const studentData = [
    { id: 1, name: "John Doe", email: "john@example.com", school: "Cheyney Univesity", track: "UX", attendance: 10 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", school: "North Carolina A & T", track: "Venture Capital", attendance: 12 },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", school: "Howard Univesity", track: "Software Engineering", attendance: 19 },
  ];

  // State for students & search
  const [students, setStudents] = useState(studentData);
  const [filteredStudents, setFilteredStudents] = useState(studentData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Handle search
  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Handle filter dropdown
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterType(filter);

    let sortedList = [...students];

    switch (filter) {
      case "school":
        sortedList.sort((a, b) => a.school.localeCompare(b.school));
        break;
      case "track":
        sortedList.sort((a, b) => a.track.localeCompare(b.track));
        break;
      case "attendanceHighLow":
        sortedList.sort((a, b) => b.attendance - a.attendance);
        break;
      case "attendanceLowHigh":
        sortedList.sort((a, b) => a.attendance - b.attendance);
        break;
      default:
        sortedList = studentData; // Reset to original list
    }

    setFilteredStudents(sortedList);
  };

  return (
    <div className="student-profile-container">
      <h1>Student Profiles</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Filter Dropdown */}
      <select value={filterType} onChange={handleFilterChange} className="filter-dropdown">
        <option value="">Filter By</option>
        <option value="school">School</option>
        <option value="track">Track</option>
        <option value="attendanceHighLow">Attendance Count (Highest to Lowest)</option>
        <option value="attendanceLowHigh">Attendance Count (Lowest to Highest)</option>
      </select>

      {/* Student Profile List */}
      <div className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <UserProfileCard
              key={student.id}
              name={student.name}
              email={student.email}
              school={student.school}
              track={student.track}
              attendance={student.attendance}
            />
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfilePage;