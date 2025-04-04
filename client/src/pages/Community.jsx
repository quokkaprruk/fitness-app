import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  // Fetch announcements and events from the backend
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

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/events`);
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchAnnouncements();
    fetchEvents();
  }, []);

  // Filter events for the selected date
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate.toLocaleDateString() === date.toLocaleDateString();
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="community-page">
      <h1 className="coming-soon-title"> Community Page Coming Soon! </h1>
      <p className="coming-soon-subtext">
        Exciting events, workshops, and classes from all across Canada – Stay tuned!
      </p>

      <div className="community-container">
        {/* Calendar Section */}
        <div className="calendar-section">
          <h2>Events Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="calendar"
          />
          <p>Selected Date: {date.toLocaleDateString()}</p>
        </div>

        {/* Announcements Section */}
        <div className="announcements-section">
          <h2> Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a, index) => (
                <li key={index} className="announcement-item">
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <span className="announcement-date">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Events Section */}
        <div

