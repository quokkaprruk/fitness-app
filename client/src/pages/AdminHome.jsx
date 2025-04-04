import { AuthContext } from "../context/authContextValue";
import "./styles/AdminHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { useState, useEffect, useContext } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import moment from "moment";

const AdminHome = () => {
  const { token, user } = useContext(AuthContext);
  const classes = [
    "Cardio",
    "HIIT",
    "Yoga",
    "Weight Training",
    "Pilates",
    "Meditation",
  ];
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const locations = ["online", "on-site"];
  const navigate = useNavigate();
  const [fitnessClasses, setFitnessClasses] = useState([]); //for all classes from db
  const [schedule, setSchedule] = useState([]); //for generated schedule
  const [trainers, setTrainers] = useState([]); // for getting trainer
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); //for pagination
  const classesPerPage = 15;
  const [filters, setFilters] = useState({
    className: "",
    classLevel: "",
    classLocation: "",
    instructorFirstName: "",
    startDate: "",
    endDate: "",
  });

  //0. get trainers from Db
  const fetchTrainer = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/trainers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const trainers = response.data;
      setTrainers(trainers);
      return trainers;
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setError("Failed to fetch trainers.");
      return [];
    }
  };
  //1. get schedules  from backend
  const fetchSchedule = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/schedules/`,
      );

      const schedule = response.data;

      setFitnessClasses(schedule);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        await fetchSchedule();
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchScheduleData();
  }, []);

  //2. generate schedule fetch from backend
  const fetchGenerateSchedule = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/schedules/generate-schedule`,
      );

      const trainers = response.data.trainers;
      const schedule = response.data.schedule;

      setSchedule(schedule);

      // Pass both trainers and schedule to the navigation state:
      navigate("/genSchedule", {
        state: { trainers: trainers, schedule: schedule },
      });
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  //3. formatDate
  function formatDate(dateString) {
    if (!dateString) {
      return "N/A";
    }
    return moment(dateString).format("M/D/YYYY, h:mm A");
  }
  const [classEntries, setClassEntries] = useState([
    {
      className: "",
      classType: "Online",
      startDateTime: "",
      endDateTime: "",
      instructorID: "",
      studentCapacity: "",
    },
  ]);

  //4. edit a class
  const handleEdit = (classItem) => {
    setEditingClass({
      ...classItem,
      startDateTime: classItem.startDateTime
        ? moment(classItem.startDateTime).format("YYYY-MM-DDTHH:mm")
        : "",
      endDateTime: classItem.endDateTime
        ? moment(classItem.endDateTime).format("YYYY-MM-DDTHH:mm")
        : "",
    });
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //5.for confirm save update to database
  const handleSaveEdit = async () => {
    try {
      // Format the date/time to ISO string before storing in db
      const formattedEditingClass = {
        ...editingClass,
        startDateTime: moment(editingClass.startDateTime).toISOString(),
        endDateTime: moment(editingClass.endDateTime).toISOString(),
        instructorFirstName: editingClass.instructorFirstName,
      };
      console.log("Editing class:", editingClass);

      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/schedules/${
          formattedEditingClass._id
        }`,
        formattedEditingClass,
      );

      //update table's row
      setFitnessClasses(
        fitnessClasses.map((c) =>
          c._id === formattedEditingClass._id ? formattedEditingClass : c,
        ),
      );

      setEditingClass(null);
      alert("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Schedule update failed!");
    }
  };

  //6.for confirm delete from database
  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/schedules/${classId}`,
        );

        setFitnessClasses(fitnessClasses.filter((c) => c._id !== classId));
        alert("Schedule deleted successfully!");
      } catch (error) {
        console.error("Error deleting class:", error);
        setError(error.response ? error.response.data.message : error.message);
        alert("Schedule deletion failed!");
      }
    }
  };

  //7.for filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredClasses = fitnessClasses.filter((classItem) => {
    const startDateFilter = filters.startDate
      ? moment(filters.startDate)
      : null;
    const endDateFilter = filters.endDate ? moment(filters.endDate) : null;
    const classStartDate = moment(classItem.startDateTime);

    return (
      (!filters.className || classItem.className === filters.className) &&
      (!filters.classLevel ||
        classItem.difficultyLevel === filters.classLevel) &&
      (!filters.classLocation ||
        classItem.location === filters.classLocation) &&
      (!filters.instructorFirstName ||
        classItem.instructorFirstName
          .toLowerCase()
          .includes(filters.instructorFirstName.toLowerCase())) &&
      (!startDateFilter ||
        classStartDate.isSameOrAfter(startDateFilter, "day")) &&
      (!endDateFilter || classStartDate.isSameOrBefore(endDateFilter, "day"))
    );
  });

  //For pagination
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = filteredClasses.slice(
    indexOfFirstClass,
    indexOfLastClass,
  );

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  /////////////////////////// Create a class Form ///////////////////////////
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newClassEntries = [...classEntries];
    newClassEntries[index] = { ...newClassEntries[index], [name]: value };
    setClassEntries(newClassEntries);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // set attribute to match backend
    const newClasses = classEntries.map((entry) => ({
      className: entry.className,
      difficultyLevel: entry.classLevel,
      location: entry.classLocation,
      startDateTime: entry.startDateTime,
      endDateTime: entry.endDateTime,
      instructorId: entry.trainerId,
      studentCapacity: parseInt(entry.studentCapacity),
    }));

    console.log("Submitted Form Data:", newClasses);

    try {
      const response = await fetch("/api/admin/add-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClasses),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Classes saved:", data);
        // for fitness classes show in frontend
        setFitnessClasses((prev) => [...prev, ...newClasses]);
        setClassEntries([
          {
            className: "",
            classLocation: "online",
            startDateTime: "",
            endDateTime: "",
            trainerId: "",
            studentCapacity: "",
          },
        ]);
      } else {
        console.error("Failed to save classes:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving classes:", error);
    }
  };

  const addClassEntry = () => {
    setClassEntries([
      ...classEntries,
      {
        className: "",
        classLocation: "online",
        startDateTime: "",
        endDateTime: "",
        trainerId: "",
        studentCapacity: "",
      },
    ]);
  };

  const removeClassEntry = (index) => {
    if (classEntries.length > 1) {
      setClassEntries(classEntries.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="app-container">
      <div id="manage-schedule-heading" className="manage-gen">
        <h1>Manage Schedules</h1>
        <button className="generate-btn" onClick={fetchGenerateSchedule}>
          {loading ? "Generating..." : "Generate Schedule"}
        </button>
      </div>
      {error && <div className="admin-gen-error-message">{error}</div>}
      <form onSubmit={handleFormSubmit} className="form-container">
        <h3>Create New Class Schedule</h3>
        {classEntries.map((entry, index) => (
          <div key={index} className="form-inputs">
            <div className="input-row1">
              <select
                name="className"
                value={entry.className}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="form-input"
              >
                <option value="">Select Class</option>{" "}
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              <select
                name="classLevel"
                value={entry.classLevel}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="form-input"
              >
                <option value="">Select Level</option>{" "}
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                name="classLocation"
                value={entry.location}
                onChange={(e) => handleInputChange(e, index)}
                className="form-input"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <select
                name="studentCapacity"
                value={entry.studentCapacity}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="form-input"
              >
                <option value="">Select Capacity</option>{" "}
                {/* Placeholder option */}
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-row2">
              <select
                name="trainerId"
                value={entry.trainerId}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="form-input"
                onClick={fetchTrainer}
              >
                <option value="">Select Instructor</option>{" "}
                {/* Placeholder option */}
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.firstName}
                  </option>
                ))}
              </select>

              <div className="date-input">
                <label>Start:</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={entry.startDateTime}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  className="form-input"
                />
              </div>
              <div className="date-input">
                <label>End:</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={entry.endDateTime}
                  onChange={(e) => handleInputChange(e, index)}
                  required
                  className="form-input"
                />
              </div>
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeClassEntry(index)}
                className="remove-class-button"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button
            className="add-multiple-classes-button"
            onClick={addClassEntry}
          >
            <FaPlus />
            <span>Create Another Class</span>
          </button>
          <button type="submit" className="add-class-button">
            Save
          </button>
        </div>
      </form>

      {/* Combine */}
      {/* Filter + Table */}
      <div className="admin-filter-and-table-container">
        <div className="admin-filter-container">
          <h3>All Scheduled Classes</h3>
          <div className="filter-inputs">
            <select
              name="className"
              value={filters.className}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Select Class</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            <select
              name="classLevel"
              value={filters.classLevel}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <select
              name="classLocation"
              value={filters.classLocation}
              onChange={handleFilterChange}
              className="filter-input"
            >
              <option value="">All Study Mode</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <input
              name="instructorFirstName"
              value={filters.instructorFirstName}
              onChange={handleFilterChange}
              className="filter-input"
              placeholder="Instructor First Name"
            ></input>

            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>
        </div>

        {/* Class list */}
        <div className="admin-class-list-container">
          {currentClasses.length > 0 ? (
            <div className="admin-class-list">
              <div className="admin-class-list-header">
                <div className="admin-class-list-item" style={{ width: "25%" }}>
                  Class Name
                </div>
                <div className="admin-class-list-item" style={{ width: "15%" }}>
                  Type
                </div>
                <div className="admin-class-list-item" style={{ width: "20%" }}>
                  Start Date
                </div>
                <div className="admin-class-list-item" style={{ width: "20%" }}>
                  End Date
                </div>
                <div className="admin-class-list-item" style={{ width: "15%" }}>
                  Instructor
                </div>
                <div className="admin-class-list-item" style={{ width: "10%" }}>
                  Capacity
                </div>
                <div className="admin-class-list-item" style={{ width: "20%" }}>
                  Actions
                </div>
              </div>

              {currentClasses.map((classItem) => (
                <div className="admin-class-list-row" key={classItem._id}>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "25%" }}
                  >
                    {classItem.className}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "15%" }}
                  >
                    {classItem.difficultyLevel}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "20%" }}
                  >
                    {formatDate(classItem.startDateTime)}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "20%" }}
                  >
                    {formatDate(classItem.endDateTime)}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "15%" }}
                  >
                    {classItem.instructorFirstName}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "10%" }}
                  >
                    {classItem.studentCapacity}
                  </div>
                  <div
                    className="admin-class-list-item"
                    style={{ width: "20%" }}
                  >
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="admin-edit-button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem._id)}
                      className="admin-delete-button"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No classes match the selected filters.</p>
          )}
          {filteredClasses.length > classesPerPage && (
            <nav>
              <ul className="admin-dash-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        onClick={() => paginate(number)}
                        className="page-link"
                      >
                        {number}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          )}
        </div>
      </div>
      {/*Modal window */}
      {editingClass && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Class</h2>
            <label>Class name: </label>
            <select
              name="className"
              value={editingClass.className}
              onChange={handleEditInputChange}
              required
            >
              <option value="">Select Class</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
            <label>Difficulty Level: </label>
            <select
              name="difficultyLevel"
              value={editingClass.difficultyLevel}
              onChange={handleEditInputChange}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <label>Instructor: </label>
            <input
              type="text"
              name="instructorFirstName"
              value={editingClass.instructorFirstName}
              onChange={handleEditInputChange}
              required
            />
            <label>Location: </label>
            <select
              name="location"
              value={editingClass.location}
              onChange={handleEditInputChange}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <label>Start: </label>
            <input
              type="datetime-local"
              name="startDateTime"
              value={editingClass.startDateTime}
              onChange={handleEditInputChange}
              required
            />
            <label>End: </label>
            <input
              type="datetime-local"
              name="endDateTime"
              value={editingClass.endDateTime}
              onChange={handleEditInputChange}
              required
            />

            <label>Capacity: </label>
            <input
              type="number"
              name="studentCapacity"
              value={editingClass.studentCapacity}
              onChange={handleEditInputChange}
              placeholder="Student Capacity"
              required
            />
            <button onClick={handleSaveEdit}>Save Changes</button>
            <button onClick={() => setEditingClass(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
