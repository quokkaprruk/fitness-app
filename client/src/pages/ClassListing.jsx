import React, { useEffect, useState } from "react";
import "./styles/ClassList.css";
import fitnessClasses from "../data/fitnessClasses.json";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    classType: "",
    timeOfDay: "",
    difficultyLevel: "",
  });

  // Simulate fetching classes from the JSON file
  useEffect(() => {
    try {
      setClasses(fitnessClasses.fitnessClasses); // Set classes data
      setFilteredClasses(fitnessClasses.fitnessClasses); // Initially show all classes
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

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      filterClasses(newFilters); // Apply the filter immediately
      return newFilters;
    });
  };

  // Filter classes based on the selected filters
  const filterClasses = (filters) => {
    let filtered = classes;

    if (filters.classType) {
      filtered = filtered.filter(
        (classItem) => classItem.classType === filters.classType,
      );
    }

    if (filters.timeOfDay) {
      const hours = new Date().getHours();
      if (filters.timeOfDay === "Morning") {
        filtered = filtered.filter(
          (classItem) => new Date(classItem.startDateTime).getHours() < 12,
        );
      } else if (filters.timeOfDay === "Afternoon") {
        filtered = filtered.filter(
          (classItem) =>
            new Date(classItem.startDateTime).getHours() >= 12 &&
            new Date(classItem.startDateTime).getHours() < 18,
        );
      } else if (filters.timeOfDay === "Evening") {
        filtered = filtered.filter(
          (classItem) => new Date(classItem.startDateTime).getHours() >= 18,
        );
      }
    }

    if (filters.difficultyLevel) {
      filtered = filtered.filter(
        (classItem) => classItem.difficultyLevel === filters.difficultyLevel,
      );
    }

    setFilteredClasses(filtered);
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

      {/* Filters Section */}
      <div className="filters">
        <select
          name="classType"
          onChange={handleFilterChange}
          value={filters.classType}
        >
          <option value="">All Class Types</option>
          <option value="Yoga">Yoga</option>
          <option value="Pilates">Pilates</option>
          <option value="Cardio">Cardio</option>
        </select>

        <select
          name="timeOfDay"
          onChange={handleFilterChange}
          value={filters.timeOfDay}
        >
          <option value="">All Times of Day</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>

        <select
          name="difficultyLevel"
          onChange={handleFilterChange}
          value={filters.difficultyLevel}
        >
          <option value="">All Difficulty Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Display Filtered Classes */}
      <ul>
        {filteredClasses.map((classItem) => (
          <li key={classItem.classId} className="class-item">
            <h3>
              {classItem.classType} - {classItem.difficultyLevel}
            </h3>
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
