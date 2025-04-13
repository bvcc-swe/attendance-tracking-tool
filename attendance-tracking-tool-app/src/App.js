import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentProfilePage from "./components/StudentProfilePage.js";
import StudentProfileButton from "./components/StudentProfileButton";

function App() {
  return (
    <Router>
      <div>
        {/* the button used to navigate to the student profile page is rendered here */}
        <StudentProfileButton />

        <Routes>
          {/* Define the route for the Student Profile page */}
          <Route path="/student-profile" element={<StudentProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
