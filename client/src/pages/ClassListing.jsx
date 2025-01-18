
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ClassList.css";

const ClassList = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/classes")
      .then((response) => setClasses(response.data))
      .catch((error) => console.error("Error fetching classes:", error));
  }, []);

  const handleReserve = (classId) => {
    axios
      .post(`http://localhost:5000/api/classes/${classId}/reserve`)
      .then((response) => alert("Reservation successful!"))
      .catch((error) => alert("Error reserving class: " + error.message));
  };

  return (
    <div className="class-list">
      <h2>Available Classes</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id} className="class-item">
            <h3>{classItem.name}</h3>
            <p>{classItem.description}</p>
            <button onClick={() => handleReserve(classItem.id)}>Reserve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
