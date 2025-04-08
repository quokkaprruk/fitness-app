import "./styles/AdminGenSchedule.css";
import { AuthContext } from "../context/authContextValue";
import axios from "axios";
import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AdminGenSchedule = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedClass, setEditedClass] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = schedule ? Math.ceil(schedule.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedSchedule = schedule
    ? schedule.slice(startIndex, startIndex + itemsPerPage)
    : [];

  //0. get trainers from Db
  const fetchTrainer = useMemo(() => {
    return async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/trainers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("Trainers data:", response.data);
        setTrainers(response.data);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to fetch trainers.");
      }
    };
  }, [token]); // Dependency: re-fetch if token changes

  useEffect(() => {
    const fetchData = async () => {
      await fetchTrainer();
    };

    console.log("Token changed:", token);
    fetchData();
  }, [fetchTrainer, token]);

  //1. get generate schedules from backend
  useEffect(() => {
    const fetchGenerateSchedule = async (trainers) => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/api/schedules/generate-schedule`,
          { trainers: trainers }, // second arg: body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } // third arg is config
        );
        console.log("Schedule data:", response.data);
        const schedule = response.data;
        setSchedule(schedule);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    if (trainers.length > 0) {
      console.log(`trainer length: ${trainers.length}`);
      console.log("Trainers:", trainers);
      fetchGenerateSchedule(trainers);
    }
  }, [trainers, token]);

  //For SaveToDB
  const saveToDb = async (schedule) => {
    setIsSaving(true);
    try {
      console.log("Schedule data sent from frontEnd:", schedule);
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/schedules/save-generated-schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ schedule: schedule }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const responseData = await response.json();
      console.log("Schedule saved successfully:", responseData);

      setSchedule([]); // clear the schedule
      if (
        window.confirm(
          "Schedule saved successfully.\nYou will be redirected to the Admin Dashboard."
        )
      ) {
        navigate("/admin");
      }
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : err.message;

      console.error(
        "Error saving schedule:",
        err.response ? err.response.data.message : err.message
      );
      alert(`Error saving schedule: ${errorMessage}`);
    } finally {
      setIsSaving(false); //end loading
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

        //Check for conflicts
        const conflictExists = schedule.some(
          (otherItem) =>
            otherItem.instructorId === updatedItem.instructorId &&
            otherItem.startDateTime === editedClass.startDateTime &&
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
        updatedItem.startDateTime = editedClass.startDateTime;
        updatedItem.endDateTime = editedClass.endDateTime;
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

  // Pagination
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <div className="gen-schedule-container">
      <h1>Generate Schedule</h1>
      <p>
        This schedule will be saved to the database when the Save button is
        clicked.
      </p>
      {/* Show error */}
      {error && <p className="error-message">{error}</p>}
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
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save To Database"}
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
                    ? moment(editedClass.startDateTime).format(
                        "YYYY-MM-DDTHH:mm"
                      )
                    : moment(classItem.startDateTime).format("YYYY-MM-DDTHH:mm")
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
                    ? moment(editedClass.endDateTime).format("YYYY-MM-DDTHH:mm")
                    : moment(classItem.endDateTime).format("YYYY-MM-DDTHH:mm")
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
                    {trainer.firstName} {trainer.lastName}
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
            <button
              className="gen-admin-prev-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="gen-admin-prev-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next Page
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
