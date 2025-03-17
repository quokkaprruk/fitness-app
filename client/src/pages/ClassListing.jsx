import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ClassList.css";
import Navbar from "../components/Navbar.jsx";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservingStatus, setReservingStatus] = useState({});
  const [classTypes, setClassTypes] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    classType: "",
    timeOfDay: "",
    difficultyLevel: "",
  });

  // Fetch classes from the backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes`
        );
        const data = response.data;

        setClasses(data);
        setFilteredClasses(data);

        const uniqueClassTypes = [
          ...new Set(data.map((item) => item.classType)),
        ];
        setClassTypes(uniqueClassTypes);
      } catch (err) {
        setError("Error loading classes data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    filterClasses();
  }, [filters, classes]);

  const [reservedClasses, setReservedClasses] = useState({});

  const handleReserve = (classId) => {
    setReservingStatus((prevStatus) => ({
      ...prevStatus,
      [classId]: true,
    }));

    setTimeout(() => {
      alert(`Reservation successful for class ID: ${classId}`);
      setReservingStatus((prevStatus) => ({
        ...prevStatus,
        [classId]: false,
      }));
      setReservedClasses((prevReserved) => ({
        ...prevReserved,
        [classId]: true,
      }));
    }, 1000);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filter classes based on the selected filters
  const filterClasses = () => {
    let filtered = classes;

    if (filters.classType) {
      filtered = filtered.filter(
        (classItem) => classItem.classType === filters.classType
      );
    }

    if (filters.timeOfDay) {
      filtered = filtered.filter((classItem) => {
        const hour = new Date(classItem.startDateTime).getHours();
        if (filters.timeOfDay === "Morning") return hour < 12;
        if (filters.timeOfDay === "Afternoon") return hour >= 12 && hour < 18;
        if (filters.timeOfDay === "Evening") return hour >= 18;
        return true;
      });
    }

    if (filters.difficultyLevel) {
      filtered = filtered.filter(
        (classItem) => classItem.difficultyLevel === filters.difficultyLevel
      );
    }

    setFilteredClasses(filtered);
  };

  if (isLoading) return <div>Loading classes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="class-list">
      <Navbar isLoggedIn={false} />
      <div className="classlist-navbar-spacer"></div>
      <div className="class-list-container">
        <h2>Available Classes</h2>

        {/* Filters Section */}
        <div className="filters">
          <select
            name="classType"
            onChange={handleFilterChange}
            value={filters.classType}
          >
            <option value="">All Class Types</option>
            {classTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
            <li key={classItem._id} className="class-item">
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
                onClick={() => handleReserve(classItem._id)}
                disabled={
                  reservingStatus[classItem._id] ||
                  reservedClasses[classItem._id]
                }
                className={`reserve-button ${
                  reservedClasses[classItem._id] ? "reserved" : ""
                }`}
              >
                {reservingStatus[classItem._id]
                  ? "Reserving..."
                  : reservedClasses[classItem._id]
                  ? "Reserved"
                  : "Reserve"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassList;
