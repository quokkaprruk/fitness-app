import { useEffect, useState } from "react";
import "./styles/Community.css";

const Community = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from your backend
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/announcements");
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
      <h1 className="coming-soon-title"> Community Page Coming Soon! </h1>
      <p className="coming-soon-subtext">
        Exciting events, workshops, and classes from all across Canada – Stay tuned!
      </p>

      <div className="community-container">
        <div className="placeholder-section">
          <h2> Events & Activities</h2>
          <p>We're getting things ready... Events will be listed here soon!</p>
          <img
            src="https://i.imgur.com/8zF8QZz.png"
            alt="Coming Soon"
            className="coming-soon-img"
          />
        </div>

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
      </div>
    </div>
  );
};

export default Community;
