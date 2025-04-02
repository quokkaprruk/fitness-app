import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Fetch announcements and events from your backend
    const fetchData = async () => {
      try {
        // Fetch announcements
        const announcementsResponse = await fetch("http://localhost:5000/api/announcements");
        if (!announcementsResponse.ok) throw new Error("Failed to fetch announcements");
        const announcementsData = await announcementsResponse.json();
        
        // Fetch events
        const eventsResponse = await fetch("http://localhost:5000/api/events");
        if (!eventsResponse.ok) throw new Error("Failed to fetch events");
        const eventsData = await eventsResponse.json();
        
        setAnnouncements(announcementsData);
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const event = events.find(e => 
        new Date(e.date).toDateString() === date.toDateString()
      );
      return event ? <div className="event-marker">•</div> : null;
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      <p className="community-subtext">
        Stay updated with the latest announcements and events
      </p>

      <div className="community-container">
        <div className="calendar-section">
          <h2>Community Calendar</h2>
          <div className="calendar-container">
            <Calendar 
              onChange={setDate}
              value={date}
              tileContent={tileContent}
            />
          </div>
          
          <div className="events-for-date">
            <h3>Events on {date.toLocaleDateString()}</h3>
            {getEventsForSelectedDate().length === 0 ? (
              <p>No events scheduled for this day.</p>
            ) : (
              <ul className="event-list">
                {getEventsForSelectedDate().map((event, index) => (
                  <li key={index} className="event-item">
                    <h4>{event.title}</h4>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="announcements-section">
          <h2>Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a, index) => (
                <li key={index} className="announcement-item">
                  <h4>{a.title || "Announcement"}</h4>
                  <p>{a.message}</p>
                  <span className="announcement-date">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;