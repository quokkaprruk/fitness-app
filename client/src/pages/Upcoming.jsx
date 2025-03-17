import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import "./styles/Upcoming.css";

const Upcoming = () => {
  const [reservedClasses, setReservedClasses] = useState([]);

  useEffect(() => {
    const storedReservations =
      JSON.parse(localStorage.getItem("reservedClasses")) || [];
    setReservedClasses(storedReservations);
  }, []);

  // Function to cancel a reservation with confirmation
  const handleCancel = (classId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (confirmCancel) {
      const updatedReservations = reservedClasses.filter(
        (classItem) => classItem.classId !== classId
      );
      setReservedClasses(updatedReservations);
      localStorage.setItem(
        "reservedClasses",
        JSON.stringify(updatedReservations)
      );
      alert("Reservation canceled.");
    }
  };

  return (
    <div className="reserved-classes">
      <Navbar isLoggedIn={true} />
      <div className="upcoming-navbar-spacer"></div>
      <h2>Find all your class reservations:</h2>

      {reservedClasses.length === 0 ? (
        <p>You have no upcoming classes.</p>
      ) : (
        <ul>
          {reservedClasses
            .sort(
              (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
            ) // Sort in ascending order
            .map((classItem) => (
              <li key={classItem.classId} className="class-item">
                <h3 className="reserved-classes-name">
                  {classItem.classType} - {classItem.difficultyLevel}
                </h3>
                <p className="reserved-classes-p">
                  <strong>Time:</strong>{" "}
                  {new Date(classItem.startDateTime).toLocaleString()} -{" "}
                  {new Date(classItem.endDateTime).toLocaleString()}
                </p>
                <p className="reserved-classes-p">
                  <strong>Capacity:</strong> {classItem.studentCapacity}
                </p>
                <button
                  className="cancel-booking-button"
                  onClick={() => handleCancel(classItem.classId)}
                >
                  Cancel Reservation
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Upcoming;
