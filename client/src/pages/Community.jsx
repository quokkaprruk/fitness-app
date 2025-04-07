import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { FaBullhorn, FaCalendarAlt, FaRunning } from "react-icons/fa";
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [date, setDate] = useState(new Date());

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

  const filteredEvents = announcements.filter((item) => {
    return new Date(item.eventDate).toLocaleDateString() === date.toLocaleDateString();
  });

  const todayQuote = "Push yourself, because no one else is going to do it for you 💪";

  return (
    <div className="community-page">
      <h1 className="coming-soon-title">💬 Fitness Community</h1>
      <p className="coming-soon-subtext">
        Join our vibrant community for classes, events, and exclusive offers!
      </p>

      <motion.div 
        className="quote-banner"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <strong>🔥 Quote of the Day:</strong> {todayQuote}
      </motion.div>

      <div className="community-container">
        <motion.div className="calendar-section" whileHover={{ scale: 1.02 }}>
          <h2><FaCalendarAlt /> Events Calendar</h2>
          <Calendar onChange={handleDateChange} value={date} className="calendar" />
          <p>Selected Date: {date.toLocaleDateString()}</p>
        </motion.div>

        <motion.div className="announcements-section" whileHover={{ scale: 1.02 }}>
          <h2><FaBullhorn /> Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a, index) => (
                <li key={index} className="announcement-item">
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <span className="announcement-date">
                    📅 {new Date(a.eventDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div className="events-section" whileHover={{ scale: 1.02 }}>
          <h2><FaRunning /> Events on Selected Date</h2>
          {filteredEvents.length === 0 ? (
            <p>No events on this date.</p>
          ) : (
            <ul className="event-list">
              {filteredEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <h4>{event.title}</h4>
                  <p>{event.message}</p>
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
