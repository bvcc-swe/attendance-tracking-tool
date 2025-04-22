import React, { useState } from "react";
import Papa from "papaparse";
import UserProfileCard from "./UserProfileCard";
import UploadButton from "./UploadButtonComponent";

const CsvParser = () => {
  // Define students state to store the parsed data
  const [students, setStudents] = useState([]);
  const [showProfiles, setShowProfiles] = useState(false);

  // Function to send parsed data to backend
  const storeStudents = async (studentsArray) => {  //store students is the backend async function in importCSV.js that handles storing the CSV data
    try {
      const response = await fetch("http://localhost:3000/upload-csv", { //posts the parsed array to the back end
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: studentsArray }),
      });

      if (response.ok) {
        console.log("Data successfully sent to the backend!");
      } else {
        console.error("Error uploading data");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // This function is passed to UploadButton
  const handleFileUpload = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const filteredData = rows.slice(1).map((row) => ({
          name: row[0],              // Column A
          email: row[1],             // Column B
          university: row[2],        // Column C
          major: row[3],             // Column D
          classification: row[4],    // Column E
          track: row[5],             // Column F
          attendance_count: parseInt(row[6], 10), // Column G
          isEligibleForCertificate: parseInt(row[6], 10) >= 7 //converts attendanceCount to a number using parseInt() (CSV parsing defaults to strings).
        }));
        setStudents(filteredData); // Store parsed data in state
        storeStudents(filteredData); // Send parsed data to backend
      },
      header: false,
    });
  };
   // Toggle the display of profiles
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