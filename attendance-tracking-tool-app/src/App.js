import './App.css';
import UploadButton from './components/UploadButtonComponent';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentProfilePage from "./components/StudentProfilePage.js";


function App() {
  return (
    <Router>
      <div>
        {/* the button used to upload the CSV is rendered here */}
        <UploadButton />
        

        <Routes>
          {/* Define the route for the Student Profile page */}
          <Route path="/student-profile" element={<StudentProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
//This is exactly how the homepage should look like. Contain a button to upload a csv file and another to view student profiles