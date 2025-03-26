import React from "react";
import logo from './logo.svg';
import './App.css';
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

       {/* Render the StudentProfile page */}
       <StudentProfile />
    </div>
  );
}

export default App;
