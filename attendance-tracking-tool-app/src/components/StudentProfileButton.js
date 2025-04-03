//This is the code for the button that allows the user of the application 
import React from 'react';
import { useNavigate } from "react-router-dom";  // Import the useNavigate hook
import { Link } from 'react-router-dom';
import '../styles/StudentProfileButton.css';

function StudentProfileButton() {

    const navigate = useNavigate();  // Get the navigate function

  const handleClick = () => {
    navigate("/student-profile-page");  // Navigates User to the Student Profile page
  };

  return (
    
    <Link to="/student-profile">
        <button onClick={handleClick} >
      View Student Profiles
    </button>
  </Link>
  );
}

export default StudentProfileButton;