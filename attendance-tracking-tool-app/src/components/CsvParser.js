import React from "react";
import Papa from "papaparse";
import UploadButton from "./UploadButtonComponent.tsx"; // adjust path as needed

const CsvParser = () => {
  // Function to send parsed data to backend
  const storeStudents = async (studentsArray) => {
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
          attendanceCount: parseInt(row[6], 10), // Column G
          isEligibleForCertificate: parseInt(row[6], 10) >= 7 //converts attendanceCount to a number using parseInt() (CSV parsing defaults to strings).
        }));

        storeStudents(filteredData); // Send parsed data to backend
      },
      header: false,
    });
  };

  return (
    <div>
      <UploadButton onFileUpload={handleFileUpload} />
    </div>
  );
};

export default CsvParser;