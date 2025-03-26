import React from "react";
import "./upload.css"; // Imports existing CSS

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
            <label htmlFor="file-upload" className="upload-button">
                Upload File
            </label>
            <input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: "none" }} 
            />
        </div>
    );
};

export default UploadButton;