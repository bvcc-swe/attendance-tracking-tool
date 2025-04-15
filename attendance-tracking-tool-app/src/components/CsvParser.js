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
          name: row[1],
          email: row[2].toLowerCase(),
          university: row[3]?.toLowerCase() || "",
          track: row[4]?.toLowerCase() || "",
          attendance_count: parseInt(row[5], 10) || 1,
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