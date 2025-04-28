import React, { useState } from "react";
import Papa from "papaparse";
import UserProfileCard from "./UserProfileCard";
import UploadButton from "./UploadButtonComponent";

const CsvParser = () => {
  const [students, setStudents] = useState([]);
  const [showProfiles, setShowProfiles] = useState(false);

  // Send parsed CSV data to the backend
  const uploadToBackend = async (studentsArray) => {
    try {
      const response = await fetch("http://localhost:3000/upload-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: studentsArray }),
      });

      if (response.ok) {
        console.log(response.status) 
        console.log("Data successfully sent to the backend!");
      } else {
        console.error("Error uploading data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // Handles CSV upload and parsing (receives the parsed CSV data from the UploadButton component)
  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const filteredData = rows.slice(1).map((row) => ({
          name: row[0],
          email: row[1],
          university: row[2],
          major: row[3],
          classification: row[4],
          track: row[5],
          attendance_count: parseInt(row[6], 10),
          certificateEligibility: parseInt(row[6], 10) >= 7
        }));
        console.log(filteredData)
        setStudents(filteredData);
        uploadToBackend(students); // Correct function call
      },
      header: false,
    });
  };

  const toggleProfiles = () => {
    setShowProfiles(!showProfiles);
  };

  return (
    <div>
      <UploadButton onFileUpload={handleFileUpload} />
      <button onClick={toggleProfiles}>
        {showProfiles ? "Hide Profiles" : "Show Profiles"}
      </button>
      {showProfiles && (
        <div>
          {students.map((student, index) => (
            <UserProfileCard
              key={index}
              name={student.name}
              email={student.email}
              university={student.university}
              track={student.track}
              attendance_count={student.attendance_count}
              certificateEligibility={student.certificateEligibility}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CsvParser;