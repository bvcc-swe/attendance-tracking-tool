import React, { useState } from "react";
import Papa from "papaparse";

const CsvParser = () => {
  const [students, setStudents] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const filteredData = rows.slice(1).map((row) => ({
          id: row[0],        // Assuming first column is ID
          name: row[1],      // Second column is the Student's Name
          email: row[2],     // Third column is the student's Email
          university: row[3] // Fourth column is University
        }));
        
        setStudents(filteredData);
      },
      header: false // Set to true if CSV has headers
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <h3>Parsed Data</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>
            {student.id} - {student.name} - {student.email} - {student.university}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CsvParser;