import React, { useState, useEffect } from "react";
import data from "../data/fitnessClasses.json";
import "../styles/TrainerHome.css"; // Import the CSS file

const TrainerHome = () => {
  // Replace with actual instructor details fetched from props or API
  const instructorID = 1; // dynamic ID for the logged-in instructor
  const instructorName = "John Doe"; // dynamic Name for the logged-in instructor
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // accessing the fitnessClasses array from the imported data
    const fitnessClasses = data.fitnessClasses;

    // filter classes for the logged-in instructor
    const filteredSchedule = fitnessClasses.filter(
      (classItem) => classItem.instructorID === instructorID
    );
    setSchedule(filteredSchedule);
  }, [instructorID]);

  // The subject line for email
  const emailSubject = `Requesting schedule change for ${instructorName} (ID: ${instructorID})`;

  return (
    <div className="trainer-home">
      <h1>Welcome, Instructor {instructorName}</h1>
      <h2>Your Schedule</h2>
      {schedule.length === 0 ? (
        <p>No classes scheduled.</p>
      ) : (
        <ul className="class-list">
          {schedule.map((classItem) => (
            <li key={classItem.classId} className="class-item">
              <h3>{classItem.className}</h3>
              <p>Type: {classItem.classType}</p>
              <p>
                Time: {new Date(classItem.startDateTime).toLocaleString()} -{" "}
                {new Date(classItem.endDateTime).toLocaleString()}
              </p>
              <p>Capacity: {classItem.studentCapacity} students</p>
            </li>
          ))}
        </ul>
      )}

      <button
        className="schedule-change-button"
        onClick={() => {
          // opens Trainer's default mail app with prefilled subject for requesting schedule change
          window.location.href = `mailto:?subject=${encodeURIComponent(
            emailSubject
          )}`;
        }}
      >
        Request Schedule Change
      </button>
    </div>
  );
};

export default TrainerHome;
