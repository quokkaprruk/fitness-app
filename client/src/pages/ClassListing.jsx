import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ClassList.css";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);

  // Fetch classes
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/classes")
      .then((response) => {
        setClasses(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Error fetching classes");
        setIsLoading(false);
      });
  }, []);

  // Handle class reservation
  const handleReserve = (classId) => {
    setReserving(true);
    axios
      .post(`http://localhost:5000/api/classes/${classId}/reserve`)
      .then(() => {
        alert("Reservation successful!");
        setReserving(false);
      })
      .catch((error) => {
        alert("Error reserving class: " + error.message);
        setReserving(false);
      });
  };

  if (isLoading) {
    return <div>Loading classes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="class-list">
      <h2>Available Classes</h2>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem.id} className="class-item">
            <h3>{classItem.name}</h3>
            <p>{classItem.description}</p>
            <button
              onClick={() => handleReserve(classItem.id)}
              disabled={reserving}
            >
              {reserving ? "Reserving..." : "Reserve"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
