import './App.css';
import UploadButton from './components/UploadButtonComponent';
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import StudentProfilePage from "./components/StudentProfilePage.js";
import StudentProfileButton from './components/StudentProfileButton';


function AppContent() {
  const location = useLocation();

  const isOnStudentProfilePage = location.pathname === "/student-profile";

  return (
    <div>
      {/* Always show UploadButton */}
      <UploadButton />

      {/* Only show StudentProfileButton if not on the profile page */}
      {!isOnStudentProfilePage && <StudentProfileButton />}

      <Routes>
        <Route path="/student-profile" element={<StudentProfilePage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>

  );
}

export default App;
//This is exactly how the homepage should look like. Contain a button to upload a csv file and another to view student profiles