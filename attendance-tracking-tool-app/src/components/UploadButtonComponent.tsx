import React from "react";
import Papa, { ParseResult } from "papaparse";
import "../assets/styles/upload.css";
import { useNavigate } from "react-router-dom";

interface UploadButtonProps {
  onFileUpload?: (file: File) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
  const navigate = useNavigate();
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (onFileUpload) {
        onFileUpload(file);
      }
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results: ParseResult<any>) {
          const parsedData = results.data;
          console.log("Parsed data being sent:", parsedData);  //displays the parsed data
          try {
            
            const response = await fetch("http://localhost:6060/upload-csv", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ students: parsedData }),
            });

            if (!response.ok) {
              throw new Error("Failed to upload and parse CSV data.");
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const data = await response.text();
            console.log("response status", response.status)
            console.log("Server response:", response.body);
            alert("CSV uploaded and processed successfully!");
          } catch (error: any) {
            console.error("Error uploading parsed data:", error.message);
            alert("There was an error uploading the parsed data.");
          }
        },
      });
    }
  };

  return (
    <div className="upload-container">
      <h1 onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}>
        BVCC Attendance Tracking Tool</h1>
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload CSV File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadButton;