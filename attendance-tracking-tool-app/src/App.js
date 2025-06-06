import './App.css';
import UploadButton from './components/UploadButtonComponent';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import StudentProfilePage from "./components/StudentProfilePage.js";
import StudentProfileButton from './components/StudentProfileButton';

function AppContent() {
  const location = useLocation();
  const isOnStudentProfilePage = location.pathname === "/student-profile";
  const [ setParsedData] = useState([]); // Holds uploaded students
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/users") // replace with endpoint 
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched students from backend:", data);
        setStudents(data);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div>

      {/* Only show UploadCSVButton if the user is not on student profiles page */}
      { !isOnStudentProfilePage && <UploadButton />}


      {/* Only show StudentProfileButton if the user is not on the student profiles page */}
      {!isOnStudentProfilePage && <StudentProfileButton />}

      <Routes>
        <Route 
          path="/student-profile" 
          element={<StudentProfilePage students={students} />}  //renders the user profile cards for each student on the student profile page
        />
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