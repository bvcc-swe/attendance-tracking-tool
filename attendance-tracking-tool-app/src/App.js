import './App.css';
import UploadButton from './components/UploadButtonComponent';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentProfilePage from "./components/StudentProfilePage.js";
import StudentProfileButton from "./components/StudentProfileButton";

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage route */}
        <Route
          path="/"
          element={
            <div>
              <UploadButton />
              <StudentProfileButton />
            </div>
          }
        />

        {/* Student profile page route */}
        <Route path="/student-profile" element={<StudentProfilePage />} />
      </Routes>
    </Router>

  );
}

export default App;
//This is exactly how the homepage should look like. Contain a button to upload a csv file and another to view student profiles