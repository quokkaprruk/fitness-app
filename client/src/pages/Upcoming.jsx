import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar.jsx";
import "./styles/Upcoming.css";
import { AuthContext } from "../context/authContextValue";
import axios from "axios";

const Upcoming = () => {
  const { token, user } = useContext(AuthContext); // Get user info from context
  const [reservedClasses, setReservedClasses] = useState([]);
  const [cancelling, setCancelling] = useState({}); // Track cancel loading state

  useEffect(() => {
    if (!user || !user.id) return; // Ensure user is logged in

    const fetchReservedClasses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/upcoming?memberId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
          }
        );

        if (response.data.classes) {
          setReservedClasses(response.data.classes);
        }
      } catch (error) {
        console.error("Error fetching reserved classes:", error.message);
      }
    };

    fetchReservedClasses();
  }, [user, token]);

  // Function to cancel a reservation
  const handleCancel = async (classId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
  
    setCancelling((prevState) => ({ ...prevState, [classId]: true })); // Set loading state
  
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/upcoming/cancel/${classId}`,
        { memberId: user.id }, // Send member ID in the request body
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setReservedClasses((prevClasses) => prevClasses.filter((c) => c._id !== classId));
  
      alert("Reservation canceled.");
    } catch (error) {
      alert("Failed to cancel reservation. Please try again.");
      console.error("Error canceling reservation:", error.message);
    } finally {
      setCancelling((prevState) => ({ ...prevState, [classId]: false })); // Remove loading state
    }
  };
  

  return (
    <div className="reserved-classes">
      <Navbar isLoggedIn={true} />
      <div className="upcoming-navbar-spacer"></div>
      <h2>Your Upcoming Classes</h2>

      {reservedClasses.length === 0 ? (
        <p>You have no upcoming classes.</p>
      ) : (
        <ul>
          {reservedClasses
            .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
            .map((classItem) => (
              <li key={classItem._id} className="class-item">
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
                  onClick={() => handleCancel(classItem._id)}
                  disabled={cancelling[classItem._id]} // Disable button while canceling
                  style={{
                    backgroundColor: cancelling[classItem._id] ? "gray" : "red",
                    cursor: cancelling[classItem._id] ? "not-allowed" : "pointer",
                  }}
                >
                  {cancelling[classItem._id] ? (
                    <span className="spinner"></span> // Show spinner while canceling
                  ) : (
                    "Cancel Reservation"
                  )}
                </button>

              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Upcoming;