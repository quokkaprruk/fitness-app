import { AuthContext } from "../context/authContextValue";
import "./styles/AdminHome.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { useState, useEffect, useContext } from "react";
import { FaEdit, FaSave, FaPlus, FaTrash, FaTimes } from "react-icons/fa";
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
  const [fitnessClasses, setFitnessClasses] = useState([]); //for showing all classes from db
  const [trainers, setTrainers] = useState([]); // for getting trainer
  const [editingClassId, setEditingClassId] = useState(null); // track class being edited
  const [editedClass, setEditedClass] = useState(null);
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
    if (trainers.length > 0) {
      console.log("Trainers already fetched, skipping API call.");
      return trainers;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/trainers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/schedules/`
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
    const fetchData = async () => {
      try {
        await fetchSchedule();
        await fetchTrainer();
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchData();
  }, []);

  //4.0 Admin select row to edit
  const handleEdit = (classItem) => {
    setEditingClassId(classItem ? classItem._id : null);
    setEditedClass({ ...classItem }); // make a copy to edit
  };

  //4.2 for confirm save update to database
  const handleSave = async () => {
    const selectedTrainer = trainers.find(
      (trainer) => trainer._id === editedClass.instructorId
    );

    if (selectedTrainer) {
      console.log(
        "Instructor first name change to:",
        selectedTrainer.firstName
      );
      console.log("Instructor last name change to:", selectedTrainer.lastName);
    } else {
      console.log("Instructor not found for ID:", editedClass.instructorId);
    }
    //prepare updateData
    const updatedData = {
      className: editedClass.className,
      difficultyLevel: editedClass.difficultyLevel,
      startDateTime: editedClass.startDateTime,
      endDateTime: editedClass.endDateTime,
      instructorId: editedClass.instructorId,
      instructorFirstName: selectedTrainer ? selectedTrainer.firstName : "",
      instructorLastName: selectedTrainer ? selectedTrainer.lastName : "",
      studentCapacity: editedClass.studentCapacity,
      location: editedClass.location,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/schedules/${
          editedClass._id
        }`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Class updated successfully");
      setEditingClassId(null); // set editing row to null
      setEditedClass(null);
      await fetchSchedule();
    } catch (error) {
      alert("Error updating class");
      console.error(error);
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // setFitnessClasses(fitnessClasses.filter((c) => c._id !== classId));
        alert("Schedule deleted successfully!");
        await fetchSchedule();
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
    indexOfLastClass
  );

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  /////////////////////////// Create a class Form ///////////////////////////
  const [classEntries, setClassEntries] = useState([
    {
      className: "",
      classLevel: "",
      classLocation: "online",
      startDateTime: "",
      endDateTime: "",
      instructorId: "",
      instructorFirstName: "",
      instructorLastName: "",
      studentCapacity: "",
    },
  ]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newClassEntries = [...classEntries];
    newClassEntries[index] = { ...newClassEntries[index], [name]: value };
    setClassEntries(newClassEntries);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // set attribute to match backend
    const newClasses = classEntries.map((entry) => {
      const selectedTrainer = trainers.find(
        (trainer) => trainer._id === entry.instructorId
      );

      console.log(
        "Instructor:",
        selectedTrainer ? selectedTrainer.firstName : "N/A",
        selectedTrainer ? selectedTrainer.lastName : "N/A"
      );

      return {
        className: entry.className,
        difficultyLevel: entry.classLevel,
        location: entry.classLocation,
        startDateTime: entry.startDateTime,
        endDateTime: entry.endDateTime,
        instructorId: String(entry.instructorId),
        instructorFirstName: selectedTrainer ? selectedTrainer.firstName : "",
        instructorLastName: selectedTrainer ? selectedTrainer.lastName : "",
        studentCapacity: parseInt(entry.studentCapacity),
      };
    });

    console.log("Submitted Form Data:", newClasses);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/admin/add-schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newClasses),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Classes saved:", data);
        alert("Classes saved successfully!");
        // for fitness classes show in frontend
        await fetchSchedule();
        // setFitnessClasses((prev) => [...prev, ...newClasses]);
        // clear the form
        setTimeout(() => {
          setClassEntries([
            {
              className: "",
              classLevel: "",
              classLocation: "online",
              startDateTime: "",
              endDateTime: "",
              instructorId: "",
              instructorFirstName: "",
              instructorLastName: "",
              studentCapacity: "",
            },
          ]);
        }, 500);
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
        classLevel: "",
        classLocation: "online",
        startDateTime: "",
        endDateTime: "",
        instructorId: "",
        instructorFirstName: "",
        instructorLastName: "",
        studentCapacity: "",
      },
    ]);
  };

  const removeClassEntry = (index) => {
    if (classEntries.length > 1) {
      setClassEntries(classEntries.filter((_, i) => i !== index));
    }
  };

  // 10. For scheduled class
  // const handleClassChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedClasses = fitnessClasses.map((classItem, idx) =>
  //     idx === index ? { ...classItem, [name]: value } : classItem
  //   );
  //   // setFitnessClasses(updatedClasses);
  // };

  return (
    <div className="app-container">
      <div id="manage-schedule-heading" className="manage-gen">
        <h1>Admin Dashboard</h1>
        <button
          className="generate-btn"
          onClick={() => navigate("/genSchedule")}
        >
          Generate Schedule
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
                value={entry.classLocation}
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
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-row2">
              <select
                name="instructorId"
                value={entry.instructorId}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="form-input"
              >
                <option value="">Select Instructor</option>{" "}
                {trainers.map((trainer) => (
                  <option key={trainer._id} value={trainer._id}>
                    {trainer.firstName} {trainer.lastName}
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
            Save To Database
          </button>
        </div>
      </form>

      {/* Combine */}
      {/* Filter + Table */}
      <div className="admin-filter-and-table-container">
        <div className="admin-filter-container">
          <h3>Filters</h3>
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
            <table className="admin-class-list">
              {/* Table header */}
              <thead>
                {/* <tr>
                  <th>Class Name</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Instructor</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr> */}
                <tr>
                  <th>
                    {loading ? "Loading Schedules..." : "Scheduled Classes"}
                  </th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {currentClasses.map((classItem, index) => (
                  <tr key={classItem._id}>
                    <td>
                      <select
                        className="gena-difficultyLevel"
                        value={
                          editingClassId === classItem._id
                            ? editedClass.className
                            : classItem.className
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            className: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls, idx) => (
                          <option key={idx} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="gena-difficultyLevel"
                        value={
                          editingClassId === classItem._id
                            ? editedClass.difficultyLevel
                            : classItem.difficultyLevel
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            difficultyLevel: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      >
                        <option value="">Select Level</option>
                        {levels.map((lvl, idx) => (
                          <option key={idx} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="gena-startDateTime"
                        type="datetime-local"
                        value={
                          editingClassId === classItem._id
                            ? moment(editedClass.startDateTime).format(
                                "YYYY-MM-DDTHH:mm"
                              )
                            : moment(classItem.startDateTime).format(
                                "YYYY-MM-DD HH:mm"
                              )
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            startDateTime: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={
                          editingClassId === classItem._id
                            ? moment(editedClass.endDateTime).format(
                                "YYYY-MM-DDTHH:mm"
                              )
                            : moment(classItem.endDateTime).format(
                                "YYYY-MM-DDTHH:mm"
                              )
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            endDateTime: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      />
                    </td>
                    <td>
                      <select
                        className="gena-instructorFirstName"
                        value={
                          editingClassId === classItem._id
                            ? editedClass.instructorId
                            : classItem.instructorId
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            instructorId: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      >
                        <option value="">Select Trainer</option>
                        {trainers.map((trainer) => (
                          <option key={trainer._id} value={trainer._id}>
                            {trainer.firstName} {trainer.lastName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="gena-studentCapacity"
                        name="studentCapacity"
                        type="number"
                        value={
                          editingClassId === classItem._id
                            ? editedClass.studentCapacity
                            : classItem.studentCapacity
                        }
                        min={1}
                        max={15}
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            studentCapacity: Math.max(
                              1,
                              Math.min(15, Number(e.target.value))
                            ),
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      />
                    </td>
                    <td>
                      <select
                        className="gena-difficultyLevel"
                        value={
                          editingClassId === classItem._id
                            ? editedClass.location
                            : classItem.location
                        }
                        onChange={(e) =>
                          setEditedClass({
                            ...editedClass,
                            location: e.target.value,
                          })
                        }
                        disabled={editingClassId !== classItem._id}
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc, idx) => (
                          <option key={idx} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {editingClassId === classItem._id ? (
                        <div style={{ display: "flex" }}>
                          {/* is Editing */}
                          <button
                            onClick={() => handleSave()}
                            className="admin-edit-button"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={() => {
                              setEditingClassId(null);
                              setEditedClass(null);
                            }}
                            className="admin-delete-button"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {/* is not editing */}
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
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No classes match the selected filters.</p>
          )}
        </div>

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
                )
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
