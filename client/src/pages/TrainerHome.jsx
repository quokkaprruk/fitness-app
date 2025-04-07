import { useState, useEffect, useContext } from "react";
//import data from "../data/fitnessClasses.json"; //test data
import axios from "axios";
import logo from "../logo.png";
import "./styles/TrainerHome.css";
import { FaCog, FaUser } from "react-icons/fa";
import { AuthContext } from "../context/authContextValue";

const TrainerHome = () => {
  console.log("You are in trainer home page");
  //const instructorID = 1;
  //const instructorName = "John Doe";
  const [schedule, setSchedule] = useState([]);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (token && user) {
      console.log(
        "Making API request for schedule with instructorId:",
        user.profileObjectId,
      );

      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/schedules/${user.profileObjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => {
          console.log("Schedule data received:", response.data);
          setSchedule(response.data);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    }
  }, [token, user]);

  //email subject
  const emailSubject = `Requesting schedule change for ${user?.username} (ID: ${user?.id})`;

  return (
    <div>
      <div className="trainer-home">
        <h2>Your Schedule:</h2>
        {/*if no classes scheduled*/}
        {schedule.length === 0 ? (
          <p>No classes scheduled.</p>
        ) : (
          <ul className="class-list">
            {schedule.map((classItem) => (
              <li key={classItem._id} className="class-item">
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
            window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}`;
          }}
        >
          Request Schedule Change
        </button>
      </div>
    </div>
  );
};

export default TrainerHome;
