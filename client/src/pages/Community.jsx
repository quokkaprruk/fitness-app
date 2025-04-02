import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  // Load mock data from localStorage
  useEffect(() => {
    setAnnouncements(JSON.parse(localStorage.getItem('announcements')) || []);
    setEvents(JSON.parse(localStorage.getItem('events')) || []);
  }, []);

  // Get events for selected date
  const getDailyEvents = () => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      
      <div className="community-container">
        <div className="calendar-section">
          <h2>Community Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={({ date }) => (
              events.some(e => new Date(e.date).toDateString() === date.toDateString()) && 
              <div className="event-marker">•</div>
            )}
          />
          
          <div className="daily-events">
            <h3>Events on {date.toLocaleDateString()}</h3>
            {getDailyEvents().length > 0 ? (
              <ul>
                {getDailyEvents().map(event => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            ) : <p>No events scheduled</p>}
          </div>
        </div>

        <div className="announcements-section">
          <h2>Latest Announcements</h2>
          {announcements.length > 0 ? (
            <ul>
              {announcements.map(item => (
                <li key={item.id}>
                  <h4>{item.title}</h4>
                  <p>{item.message}</p>
                  <small>{new Date(item.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : <p>No announcements yet</p>}
        </div>
      </div>
    </div>
  );
};

export default Community;