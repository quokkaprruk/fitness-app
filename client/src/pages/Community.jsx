import { useEffect, useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`);
        if (!response.ok) throw new Error("Failed to fetch announcements");
        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="community-page">
      <h1>Community Hub</h1>
      
      <div className="community-container">
        <div className="calendar-section">
          <h2>Community Calendar</h2>
          <Calendar
            onChange={setDate}
            value={date}
          />
        </div>

        <div className="announcements-section">
          <h2>Latest Announcements</h2>
          {announcements.length === 0 ? (
            <p>No announcements yet. Check back later!</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a) => (
                <li key={a._id} className="announcement-item">
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
      </div>
    </div>
  );
};

export default Community;