import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./styles/ClassList.css";
import Navbar from "../components/Navbar.jsx";
import { AuthContext } from "../context/authContextValue";

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState({});
  const [classTypes, setClassTypes] = useState({}); 
  const { token, user } = useContext(AuthContext);
  const [reservedClasses, setReservedClasses] = useState(new Set());

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
  
        let reservedSet = new Set();
  
        if (user) {
          const reservationResponse = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/upcoming?memberId=${user.id}`
          );
          const reservedData = reservationResponse.data.classes;
  
          // Store reserved class IDs in a Set
          reservedSet = new Set(reservedData.map(item => item._id));
          setReservedClasses(reservedSet);
        }
  
        // Remove reserved classes from display
        const availableClasses = user ? data.filter(item => !reservedSet.has(item._id)) : data;
  
        setClasses(availableClasses);
        setFilteredClasses(availableClasses);
  
        const uniqueClassTypes = [...new Set(availableClasses.map(item => item.classType))];
        setClassTypes(uniqueClassTypes);
  
      } catch (err) {
        setError("Error loading classes data");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchClasses();
  }, [user]);

  // Handle class reservation
  const handleReserve = async (classId) => {
    if (!user || !user.id) {
      alert("You must be logged in to reserve a class.");
      return;
    }
  
    setReserving((prevState) => ({ ...prevState, [classId]: true }));
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/classes/reserve/${classId}`,
        { scheduleId: classId, memberId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const updatedCapacity = response.data.updatedCapacity;
  
      alert(`Reservation successful for class ID: ${classId}`);
  
      // Update class capacity in the UI
      setClasses((prevClasses) =>
        prevClasses.map((item) =>
          item._id === classId
            ? { ...item, studentCapacity: updatedCapacity }
            : item
        )
      );
  
      setFilteredClasses((prevFiltered) =>
        prevFiltered.map((item) =>
          item._id === classId
            ? { ...item, studentCapacity: updatedCapacity }
            : item
        )
      );
  
      // Remove from available list if capacity is 0
      if (updatedCapacity === 0) {
        setClasses((prevClasses) => prevClasses.filter((item) => item._id !== classId));
        setFilteredClasses((prevFiltered) => prevFiltered.filter((item) => item._id !== classId));
      }
  
      setReservedClasses((prev) => new Set([...prev, classId]));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reserve class");
    } finally {
      setReserving((prevState) => ({ ...prevState, [classId]: false }));
    }
  };
  
  

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      filterClasses(newFilters);
      return newFilters;
    });
  };

  // Filter classes based on the selected filters
  const filterClasses = (filters) => {
    let filtered = [...classes];

    if (filters.classType) {
      filtered = filtered.filter(
        (classItem) => classItem.classType === filters.classType
      );
    }

    if (filters.timeOfDay) {
      if (filters.timeOfDay === "Morning") {
        filtered = filtered.filter(
          (classItem) => new Date(classItem.startDateTime).getHours() < 12
        );
      } else if (filters.timeOfDay === "Afternoon") {
        filtered = filtered.filter(
          (classItem) =>
            new Date(classItem.startDateTime).getHours() >= 12 &&
            new Date(classItem.startDateTime).getHours() < 18
        );
      } else if (filters.timeOfDay === "Evening") {
        filtered = filtered.filter(
          (classItem) => new Date(classItem.startDateTime).getHours() >= 18
        );
      }
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
      <div className="navbar-spacer"></div>
      <h2>Available Classes</h2>

      {/* Filters Section */}
      <div className="filters">
        <select name="classType" onChange={handleFilterChange} value={filters.classType}>
          <option value="">All Class Types</option>
          {classTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="timeOfDay" onChange={handleFilterChange} value={filters.timeOfDay}>
          <option value="">All Times of Day</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>

        <select name="difficultyLevel" onChange={handleFilterChange} value={filters.difficultyLevel}>
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
            <h3>{classItem.classType} - {classItem.difficultyLevel}</h3>
            <p>Type: {classItem.classType}</p>
            <p>
              Time: {new Date(classItem.startDateTime).toLocaleString()} -{" "}
              {new Date(classItem.endDateTime).toLocaleString()}
            </p>
            <p>Capacity: {classItem.studentCapacity}</p>
            <button 
              onClick={() => handleReserve(classItem._id)} 
              disabled={reservedClasses.has(classItem._id) || reserving[classItem._id]}
              style={{ 
                backgroundColor: reservedClasses.has(classItem._id) ? "gray" : "", 
                cursor: reservedClasses.has(classItem._id) ? "not-allowed" : "pointer"
              }}
            >
              {reservedClasses.has(classItem._id) ? "Reserved" : reserving[classItem._id] ? "Reserving..." : "Reserve"}
            </button>


          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
