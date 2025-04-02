import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../styles/Admin.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });
  const [date, setDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState("");

  const saveAnnouncement = (e) => {
    e.preventDefault();
    const announcements = JSON.parse(localStorage.getItem('announcements') || [];
    const newItem = {
      ...announcement,
      date: new Date().toISOString(),
      id: Date.now()
    };
    localStorage.setItem('announcements', JSON.stringify([...announcements, newItem]));
    alert("Announcement saved!");
    setAnnouncement({ title: "", message: "" });
  };

  const saveEvent = () => {
    const events = JSON.parse(localStorage.getItem('events') || [];
    const newEvent = {
      title: eventTitle,
      date: date.toISOString(),
      id: Date.now()
    };
    localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    alert(`Event saved for ${date.toLocaleDateString()}`);
    setEventTitle("");
  };

  return (
    <div className="admin-page">
      <h2>Post Announcement</h2>
      <form onSubmit={saveAnnouncement}>
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
        <button type="submit">Post</button>
      </form>

      <div className="calendar-section">
        <h2>Add Event</h2>
        <Calendar 
          onChange={setDate} 
          value={date} 
        />
        <div className="event-form">
          <input
            type="text"
            placeholder="Event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
          <button onClick={saveEvent}>Save Event</button>
        </div>
      </div>
    </div>
  );
};

export default PostAnnouncement;