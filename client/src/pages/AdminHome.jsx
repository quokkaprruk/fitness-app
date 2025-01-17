import "../styles/AdminHome.css";
import React, { useState } from "react";
import { FaCog, FaUser, FaPlus, FaMinus } from "react-icons/fa";
import logo from "../logo.png";

const AdminHome = () => {
  const [fitnessClasses, setFitnessClasses] = useState([
    {
      classId: 1,
      instructorID: 1,
      className: "Yoga - Essential",
      classType: "Online",
      startDateTime: "2025-04-20T08:00",
      endDateTime: "2025-04-20T09:00",
      studentCapacity: 10,
    },
    {
      classId: 2,
      instructorID: 2,
      className: "Pilates - Advanced",
      classType: "On-Site",
      startDateTime: "2025-04-21T10:00",
      endDateTime: "2025-04-21T11:00",
      studentCapacity: 15,
    },
    {
      classId: 3,
      instructorID: 1,
      className: "Zumba - Intermediate",
      classType: "Online",
      startDateTime: "2025-04-22T17:00",
      endDateTime: "2025-04-22T18:00",
      studentCapacity: 20,
    },
  ]);

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

  const [filters, setFilters] = useState({
    classType: "",
    instructorID: "",
    startDate: "",
    endDate: "",
  });

  const [editingClass, setEditingClass] = useState(null);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newClassEntries = [...classEntries];
    newClassEntries[index] = { ...newClassEntries[index], [name]: value };
    setClassEntries(newClassEntries);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newClasses = classEntries.map((entry, index) => ({
      classId: fitnessClasses.length + index + 1,
      ...entry,
      instructorID: parseInt(entry.instructorID),
      studentCapacity: parseInt(entry.studentCapacity),
    }));

    setFitnessClasses((prev) => [...prev, ...newClasses]);

    setClassEntries([
      {
        className: "",
        classType: "Online",
        startDateTime: "",
        endDateTime: "",
        instructorID: "",
        studentCapacity: "",
      },
    ]);
  };

  const addClassEntry = () => {
    setClassEntries([
      ...classEntries,
      {
        className: "",
        classType: "Online",
        startDateTime: "",
        endDateTime: "",
        instructorID: "",
        studentCapacity: "",
      },
    ]);
  };

  const removeClassEntry = (index) => {
    if (classEntries.length > 1) {
      setClassEntries(classEntries.filter((_, i) => i !== index));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (classId) => {
    const classToEdit = fitnessClasses.find((c) => c.classId === classId);
    setEditingClass(classToEdit);
  };

  const handleSaveEdit = () => {
    setFitnessClasses(
      fitnessClasses.map((c) =>
        c.classId === editingClass.classId ? editingClass : c
      )
    );
    setEditingClass(null);
  };

  const handleDelete = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setFitnessClasses(fitnessClasses.filter((c) => c.classId !== classId));
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClass((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredClasses = fitnessClasses.filter((classItem) => {
    const { classType, instructorID, startDate, endDate } = filters;

    const matchesType = classType ? classItem.classType === classType : true;
    const matchesInstructor = instructorID
      ? classItem.instructorID === parseInt(instructorID)
      : true;

    const matchesStartDate = startDate
      ? new Date(classItem.startDateTime) >= new Date(startDate)
      : true;
    const matchesEndDate = endDate
      ? new Date(classItem.endDateTime) <= new Date(endDate)
      : true;

    return (
      matchesType && matchesInstructor && matchesStartDate && matchesEndDate
    );
  });

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-welcome">Welcome!</div>
        <div className="navbar-links">
          <a href="/contact">Contact</a>
          <a href="/client-management">Client Management</a>
          <a href="/community">Community</a>
          <FaCog className="icon" title="Settings" />
          <FaUser className="icon" title="Profile" />
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>

      <h1>Manage Schedules:</h1>

      <div className="filter-container">
        <h3>Find Scheduled Classes</h3>
        <select
          name="classType"
          value={filters.classType}
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="">All Types</option>
          <option value="Online">Online</option>
          <option value="On-Site">On-Site</option>
        </select>
        <input
          type="number"
          name="instructorID"
          value={filters.instructorID}
          onChange={handleFilterChange}
          placeholder="Instructor ID"
          className="filter-input"
        />
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

      <div className="class-container">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((classItem) => (
            <div key={classItem.classId} className="class-card">
              <h4>{classItem.className}</h4>
              <p>
                <strong>Type:</strong> {classItem.classType}
              </p>
              <p>
                <strong>Start:</strong> {classItem.startDateTime}
              </p>
              <p>
                <strong>End:</strong> {classItem.endDateTime}
              </p>
              <p>
                <strong>Instructor ID:</strong> {classItem.instructorID}
              </p>
              <p>
                <strong>Capacity:</strong> {classItem.studentCapacity}
              </p>
              <div className="card-actions">
                <button onClick={() => handleEdit(classItem.classId)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(classItem.classId)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No classes match the selected filters.</p>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="form-container">
        <h3>Create New Class Schedule</h3>
        {classEntries.map((entry, index) => (
          <div key={index} className="form-inputs">
            <div className="input-row">
              <input
                type="text"
                name="className"
                value={entry.className}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Class Name"
                required
                className="form-input"
              />
              <select
                name="classType"
                value={entry.classType}
                onChange={(e) => handleInputChange(e, index)}
                className="form-input"
              >
                <option value="Online">Online</option>
                <option value="On-Site">On-Site</option>
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
            </div>
            <div className="input-row">
              <input
                type="number"
                name="instructorID"
                value={entry.instructorID}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Instructor ID"
                required
                className="form-input"
              />
              <input
                type="number"
                name="studentCapacity"
                value={entry.studentCapacity}
                onChange={(e) => handleInputChange(e, index)}
                placeholder="Student Capacity"
                required
                className="form-input"
              />
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
                <FaMinus />
              </button>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="add-class-button">
            Add Classes
          </button>
          <div className="add-multiple-classes" onClick={addClassEntry}>
            <FaPlus />
            <span>Add Another Class</span>
          </div>
        </div>
      </form>

{/*Modal window to make changes to existing classes*/}
      {editingClass && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Class</h2>
            <label>Class name: </label>
            <input
              type="text"
              name="className"
              value={editingClass.className}
              onChange={handleEditInputChange}
              placeholder="Class Name"
              required
            />
            <label>Class type: </label>
            <select
              name="classType"
              value={editingClass.classType}
              onChange={handleEditInputChange}
            >
              <option value="Online">Online</option>
              <option value="On-Site">On-Site</option>
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
            <label>Instructor ID: </label>
            <input
              type="number"
              name="instructorID"
              value={editingClass.instructorID}
              onChange={handleEditInputChange}
              placeholder="Instructor ID"
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
