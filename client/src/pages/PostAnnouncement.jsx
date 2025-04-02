import { useState } from "react";
import "../pages/styles/Admin.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });
  const [date, setDate] = useState(new Date());
  const [isEvent, setIsEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  
  // Store data in localStorage
  const saveAnnouncement = () => {
    const announcements = JSON.parse(localStorage.getItem('announcements') || [];
    const newAnnouncement = {
      ...announcement,
      date: new Date().toISOString(),
      id: Date.now()
    };
    localStorage.setItem('announcements', JSON.stringify([...announcements, newAnnouncement]));
    alert("Announcement saved locally!");
    setAnnouncement({ title: "", message: "" });
  };

  const saveEvent = () => {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const newEvent = {
      title: eventTitle,
      date: date.toISOString(),
      id: Date.now()
    };
    localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    alert(`Event saved for ${date.toLocaleDateString()}`);
    setIsEvent(false);
    setEventTitle("");
  };

  return (
    <div className="admin-page">
      <h2>Post an Announcement</h2>
      <form onSubmit={(e) => { e.preventDefault(); saveAnnouncement(); }}>
        <input
          placeholder="Title"
          value={announcement.title}
          onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Message"
          value={announcement.message}
          onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
          required
        />
        <button type="submit">Post Announcement</button>
      </form>

      <div className="calendar-section">
        <h2>Add Calendar Event</h2>
        <Calendar 
          onChange={setDate}
          value={date}
          onClickDay={() => setIsEvent(true)}
        />
        
        {isEvent && (
          <div className="event-form">
            <h3>Add Event for {date.toLocaleDateString()}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
            <button onClick={saveEvent}>Save Event</button>
            <button onClick={() => setIsEvent(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAnnouncement;