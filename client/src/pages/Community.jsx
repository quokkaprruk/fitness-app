import React, { useEffect, useState, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FaBullhorn, FaCalendarAlt, FaRunning, FaHeart, FaTrash } from "react-icons/fa";
import "./styles/Community.css";
import { AuthContext } from "../context/authContextValue";

const Community = () => {
  const { token } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [date, setDate] = useState(new Date());
  const [liked, setLiked] = useState({});
@@ -30,42 +28,19 @@ const Community = () => {
    setDate(newDate);
  };

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      } else {
        alert("Failed to delete the announcement.");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Error occurred during deletion.");
    }
  };

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];
  const todayStr = formatDate(date);

  const filteredEvents = announcements.filter(
    (item) => formatDate(item.eventDate) === todayStr
  );

  const todayQuote = "Push yourself, because no one else is going to do it for you 💪";

@@ -107,8 +82,8 @@ const Community = () => {
            <p>No events on this date.</p>
          ) : (
            <ul className="event-list">
              {filteredEvents.map((event) => (
                <li key={event._id} className="event-item">
                  <h4>{event.title}</h4>
                  <p>{event.message}</p>
                </li>
@@ -123,20 +98,20 @@ const Community = () => {
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a) => (
                <li key={a._id} className="announcement-item">
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <div className="announcement-controls">
                    <button 
                      className={`like-button ${liked[a._id] ? "liked" : ""}`} 
                      onClick={() => toggleLike(a._id)}
                    >
                      <FaHeart /> {liked[a._id] ? "Liked" : "Like"}
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => deleteAnnouncement(a._id)}
                    >
                      <FaTrash /> Delete
                    </button>