import React, { useState, useEffect } from "react";
import data from "../data/fitnessClasses.json"; //test data
import logo from "../logo.png"; //image of logo
import "../styles/TrainerHome.css"; //css file
import { FaCog, FaUser } from "react-icons/fa"; //for 'profile' and 'settings' icons on navbar

const TrainerHome = () => {
  const instructorID = 1;
  const instructorName = "John Doe";
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fitnessClasses = data.fitnessClasses;
    const filteredSchedule = fitnessClasses.filter(
      (classItem) => classItem.instructorID === instructorID
    );
    setSchedule(filteredSchedule);
  }, [instructorID]);

  //email subject
  const emailSubject = `Requesting schedule change for ${instructorName} (ID: ${instructorID})`;

  return (
    <div>
      {/*nav bar*/}
      <nav className="navbar">
        <div className="navbar-welcome">Welcome, {instructorName}</div>
        <div className="navbar-links">
          <a href="#contact">Contact</a>
          <a href="#client-management">Client Management</a>
          <a href="#community">Community</a>
          <FaCog className="icon" title="Settings" />
          <FaUser className="icon" title="Profile" />
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>

      <div className="trainer-home">
        <h2>Your Schedule:</h2>
        {/*if no classes scheduled*/}
        {schedule.length === 0 ? (
          <p>No classes scheduled.</p>
        ) : (
          <ul className="class-list">
            {schedule.map((classItem) => (
              <li key={classItem.classId} className="class-item">
                <h3>{classItem.className}</h3>
                <p>
                  <strong>Type:</strong> {classItem.classType}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(classItem.startDateTime).toLocaleString()} -{" "}
                  {new Date(classItem.endDateTime).toLocaleString()}
                </p>
                <p>
                  <strong>Capacity: </strong>
                  {classItem.studentCapacity} students
                </p>
              </li>
            ))}
          </ul>
        )}

        {/*button to request change that opens default email app*/}
        <button
          className="schedule-change-button"
          onClick={() => {
            window.location.href = `mailto:?subject=${encodeURIComponent(
              emailSubject
            )}`;
          }}
        >
          Request Schedule Change
        </button>
      </div>
    </div>
  );
};

export default TrainerHome;
