import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../pages/styles/Admin.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");
  const [date, setDate] = useState(new Date());
  const [isEvent, setIsEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [events, setEvents] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const announcementData = {
      message: announcement,
      date: new Date().toISOString(),
      isEvent: false
    };
    
    console.log("Announcement Posted:", announcementData);
    alert("Announcement posted successfully!");
    setAnnouncement("");
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      title: eventTitle,
      date: date.toISOString(),
      isEvent: true
    };
    
    console.log("Event Added:", eventData);
    alert("Event added to calendar successfully!");
    setEvents([...events, eventData]);
    setEventTitle("");
    setIsEvent(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const event = events.find(e => 
        new Date(e.date).toDateString() === date.toDateString()
      );
      return event ? <div className="event-marker">•</div> : null;
    }
  };

  return (
    <div className="admin-page">
      <div className="announcement-section">
        <h2>Post an Announcement</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your announcement here..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            required
          ></textarea>
          <button type="submit">Post Announcement</button>
        </form>
      </div>

      <div className="calendar-section">
        <h2>Manage Calendar Events</h2>
        <div className="calendar-container">
          <Calendar 
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            onClickDay={() => setIsEvent(true)}
          />
        </div>

        {isEvent && (
          <form onSubmit={handleEventSubmit} className="event-form">
            <h3>Add Event for {date.toLocaleDateString()}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
            <div className="form-buttons">
              <button type="submit">Save Event</button>
              <button type="button" onClick={() => setIsEvent(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostAnnouncement;