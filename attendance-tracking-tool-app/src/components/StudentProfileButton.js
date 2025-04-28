//This is the code for the button that allows the user of the application 
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function StudentProfileButton() {
   // Navigates User to the Student Profile page
   const navigate = useNavigate();
    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '20px',
        marginLeft: '100px',
        position: 'absolute',   // Set position
        top: '100px',         // Position the button at the top of the page
        left: '25%',
        
    };
  
        return (
        <Link to="/student-profile">
            <button  onClick={() => navigate("/student-profile")} style={buttonStyle}>View Student Profiles</button>
        </Link>
    );
}

export default StudentProfileButton;