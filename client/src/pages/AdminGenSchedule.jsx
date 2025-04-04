import "./styles/AdminGenSchedule.css";
import axios from "axios";
import React, { useState } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import moment from "moment"; // Import moment

const AdminGenSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Access passed location data
  const initialSchedule = location.state?.schedule || [];
  const initialTrainers = location.state?.trainers || [];
  const [schedule, setSchedule] = useState(initialSchedule);
  const [trainers, setTrainers] = useState(initialTrainers);
  const [editMode, setEditMode] = useState(null);
  const [editedClass, setEditedClass] = useState(null);

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

  console.log("Schedule data:", schedule);
  console.log("Trainers data:", trainers);

  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = schedule ? Math.ceil(schedule.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedSchedule = schedule
    ? schedule.slice(startIndex, startIndex + itemsPerPage)
    : [];

  //For SaveToDB
  const saveToDb = async (schedule) => {
    try {
      console.log("Schedule data:", schedule);
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/schedules/save-generated-schedule`,
        { schedule: schedule }
      );

      console.log("Schedule saved successfully:", response.data);
      setSchedule([]); // Clear the schedule
      alert("Schedule saved successfully!");
      navigate("/admin");
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : err.message;

      console.error(
        "Error saving schedule:",
        err.response ? err.response.data.message : err.message
      );
      alert(`Error saving schedule: ${errorMessage}`);
    }
  };
  //For Edit
  const handleInputChange = (e, field) => {
    let value = e.target.value;

    if (field === "instructorFirstName") {
      const selectedTrainer = trainers.find((trainer) => trainer._id === value);

      if (selectedTrainer) {
        setEditedClass({
          ...editedClass,
          instructorFirstName: selectedTrainer.firstName,
          instructorLastName: selectedTrainer.lastName,
          instructorId: selectedTrainer._id,
        });
        return;
      }
    }

    if (field === "studentCapacity") {
      if (value < 1) {
        value = 1;
      } else if (value > 15) {
        value = 15;
      }
    }

    setEditedClass({
      ...editedClass,
      [field]: value,
    });
  };

  //For save the edit
  const saveEdit = (classItem) => {
    const updatedSchedule = schedule.map((item) => {
      if (
        item.className === classItem.className &&
        item.startDateTime === classItem.startDateTime
      ) {
        const updatedItem = { ...item, ...editedClass };
        //Convert datetime using moment() : backend use moment()
        const newStartTime = formatDateWithOffset(editedClass.startDateTime);
        const newEndTime = formatDateWithOffset(editedClass.endDateTime);

        //Check for conflicts
        const conflictExists = schedule.some(
          (otherItem) =>
            otherItem.instructorId === updatedItem.instructorId &&
            otherItem.startDateTime === newStartTime &&
            otherItem !== item // Exclude the current item being edited from the check
        );
        if (conflictExists) {
          alert(
            "Cannot save. This instructor already has a class scheduled at that start time."
          );
          return item;
        }

        if (
          updatedItem.studentCapacity < 1 ||
          updatedItem.studentCapacity > 15
        ) {
          alert("Student capacity must be between 1 and 15.");
          return item; //Return the original item without changes
        }
        updatedItem.startDateTime = newStartTime;
        updatedItem.endDateTime = newEndTime;
        return updatedItem;
      } else {
        return item;
      }
    });
    setSchedule(updatedSchedule);
    setEditMode(null); // Exit edit mode
  };

  //For Delete
  const deleteGen = (classItem) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (confirmed) {
      const updatedSchedule = schedule.filter(
        (item) =>
          item.className !== classItem.className ||
          item.startDateTime !== classItem.startDateTime
      );
      setSchedule(updatedSchedule);
    }
  };

  //Format date for schedule[]
  const formatDateWithOffset = (dateString) => {
    return moment(dateString).format("YYYY-MM-DDTHH:mm:ssZ");
  };

  // Pagination
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    // admin-class-list-container
    <div className="gen-schedule-container">
      <h1>Sample Generated Schedule</h1>
      <div className="gen-admin-use-ctn">
        {schedule.length > 0 && (
          <>
            <button
              className="gen-admin-back-btn"
              onClick={() => {
                navigate("/admin");
              }}
            >
              Back to Dashboard
            </button>
            <button
              className="gen-admin-use-btn"
              onClick={() => {
                saveToDb(schedule);
              }}
            >
              Use This Schedule
            </button>
          </>
        )}
      </div>
      {schedule && schedule.length > 0 ? (
        <div className="gen-schedule-list">
          <div className="gen-schedule-list-header" style={{ display: "flex" }}>
            <div>Classes</div>
            {/* <div >Type</div>
            <div >Start</div>
            <div >End</div>
            <div >Instructor</div>
            <div >Cap.</div>
            <div >Loc.</div>
            <div ></div> */}
          </div>

          {selectedSchedule.map((classItem) => (
            <div
              className="gen-schedule-list-row"
              key={`${classItem.className}-${classItem.startDateTime}-${classItem.instructorId}`}
            >
              <select
                className="gen-className"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.className
                    : classItem.className
                }
                onChange={(e) => handleInputChange(e, "className")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              >
                <option value="">Select Class</option>
                {classes.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>

              <select
                className="gen-difficultyLevel"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.difficultyLevel
                    : classItem.difficultyLevel
                }
                onChange={(e) => handleInputChange(e, "difficultyLevel")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              >
                <option value="">Select Type</option>
                {levels.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                className="gen-startDateTime"
                type="datetime-local"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.startDateTime.slice(0, 16)
                    : classItem.startDateTime.slice(0, 16)
                }
                onChange={(e) => handleInputChange(e, "startDateTime")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              />
              <input
                className="gen-endDateTime"
                type="datetime-local"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.endDateTime.slice(0, 16)
                    : classItem.endDateTime.slice(0, 16)
                }
                onChange={(e) => handleInputChange(e, "endDateTime")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              />
              <select
                className="gen-instructorFirstName"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.instructorId
                    : classItem.instructorId
                }
                onChange={(e) => handleInputChange(e, "instructorFirstName")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              >
                <option value="">Select Trainer</option>

                {trainers.map((trainer) => (
                  <option key={trainer._id} value={`${trainer._id}`}>
                    {trainer.firstName} {trainer.lastName} - {trainer._id}
                  </option>
                ))}
              </select>
              <input
                className="gen-studentCapacity"
                type="number"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.studentCapacity
                    : classItem.studentCapacity
                }
                onChange={(e) => handleInputChange(e, "studentCapacity")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              />
              <select
                className="gen-location"
                value={
                  editMode &&
                  editMode.className === classItem.className &&
                  editMode.startDateTime === classItem.startDateTime
                    ? editedClass.location
                    : classItem.location
                }
                onChange={(e) => handleInputChange(e, "location")}
                disabled={
                  !(
                    editMode &&
                    editMode.className === classItem.className &&
                    editMode.startDateTime === classItem.startDateTime
                  )
                }
              >
                <option value="">Select Type</option>
                {locations.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex" }}>
                {editMode &&
                editMode.className === classItem.className &&
                editMode.startDateTime === classItem.startDateTime ? (
                  <>
                    <button
                      onClick={() => saveEdit(classItem)}
                      className="admin-edit-button"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="admin-delete-button"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditMode(classItem);
                        setEditedClass(classItem);
                      }}
                      className="admin-edit-button"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteGen(classItem)}
                      className="admin-delete-button"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="gen-pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="gen-admin-message"> No schedule generated.</p>
        </div>
      )}
    </div>
  );
};

export default AdminGenSchedule;
