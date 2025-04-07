import React from "react";
import '../assets/styles/upload.css'; // Imports existing CSS

interface UploadButtonProps {
    onFileUpload?: (file: File) => void; // Allow parent components to handle file uploads
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (onFileUpload) {
                onFileUpload(file); // Call the function passed as a prop
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
                onChange={handleFileChange} 
                 
            />
        </div>
    );
};

export default UploadButton;  //exports the Upload button component