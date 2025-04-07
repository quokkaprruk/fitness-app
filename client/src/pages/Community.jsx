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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/announcements`);
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDateChange = (newDate) => {
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

  return (
    <div className="community-page">
      <motion.h1 
        className="coming-soon-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        💬 <span className="title-glow">Fitness Community</span>
      </motion.h1>

      <p className="coming-soon-subtext">
        Join our vibrant community for classes, events, and exclusive offers!
      </p>

      <motion.div 
        className="quote-banner"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <strong>🔥 Quote of the Day:</strong> {todayQuote}
      </motion.div>

      <div className="community-container">

        <motion.div className="calendar-section" whileHover={{ scale: 1.01 }}>
          <h2><FaCalendarAlt /> Events Calendar</h2>
          <Calendar onChange={handleDateChange} value={date} className="calendar" />
          <p>Selected Date: {date.toLocaleDateString()}</p>
        </motion.div>

        <motion.div className="events-section" whileHover={{ scale: 1.01 }}>
          <h2><FaRunning /> Events on Selected Date</h2>
          {filteredEvents.length === 0 ? (
            <p>No events on this date.</p>
          ) : (
            <ul className="event-list">
              {filteredEvents.map((event) => (
                <li key={event._id} className="event-item">
                  <h4>{event.title}</h4>
                  <p>{event.message}</p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div className="announcements-section" whileHover={{ scale: 1.01 }}>
          <h2><FaBullhorn /> Latest Announcements</h2>
          {announcements.length === 0 ? (
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
                  </div>
                  <span className="announcement-date">
                    📅 {new Date(a.eventDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Community;
