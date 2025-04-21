import React from "react";
import "../assets/styles/upload.css"; // Imports existing CSS

interface UploadButtonProps {
  onFileUpload?: (file: File) => void; // Optional callback for parent components
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Optional callback to inform parent
      if (onFileUpload) {
        onFileUpload(file);
      }

      // Prepare form data for backend
      const formData = new FormData();
      formData.append("csvFile", file); //labels file as csvFile

      //frontend pointing to backend
      try {
        const response = await fetch("http://localhost:6060", { //server that the backend is working on
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload and parse CSV file.");
        }

        const data = await response.json();
        console.log("Server response:", data);
        alert("CSV uploaded and processed successfully!");
      } catch (error: any) {
        console.error("Error uploading file:", error.message);
        alert("There was an error uploading the file.");
      }
    }
  };

  return (
    <div className="upload-container">
      <h1>BVCC Attendance Tracking Tool Homepage</h1>
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
  );c
};

export default UploadButton;