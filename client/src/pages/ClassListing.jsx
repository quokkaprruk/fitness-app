import React, { useEffect, useState } from "react";
import "../styles/ClassList.css";
import fitnessClasses from "../data/fitnessClasses.json"; 

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);

  // Simulate fetching classes from the JSON file
  useEffect(() => {
    try {
      setClasses(fitnessClasses.fitnessClasses); 
      setIsLoading(false);
    } catch (err) {
      setError("Error loading classes data");
      setIsLoading(false);
    }
  }, []);

  // Handle class reservation
  const handleReserve = (classId) => {
    setReserving(true);
    
    setTimeout(() => {
      alert(`Reservation successful for class ID: ${classId}`);
      setReserving(false);
    }, 1000);
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
          <li key={classItem.classId} className="class-item">
            <h3>{classItem.className}</h3>
            <p>Type: {classItem.classType}</p>
            <p>
              Time: {new Date(classItem.startDateTime).toLocaleString()} -{" "}
              {new Date(classItem.endDateTime).toLocaleString()}
            </p>
            <p>Capacity: {classItem.studentCapacity}</p>
            <button
              onClick={() => handleReserve(classItem.classId)}
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

