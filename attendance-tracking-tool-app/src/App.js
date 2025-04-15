import React from "react";
import './App.css';
//import UploadButton from "./components/UploadButtonComponent"; // Adjust path if needed
import CsvParser from "./components/CsvParser"; // Adjust path if needed

function App() {
  return (
    <div className="App">
       {/* Render the StudentProfile page */}
       <CsvParser />
    </div>
    // Did not render the upload button since it is being used in the Csv Parser
  );
}

export default App;
