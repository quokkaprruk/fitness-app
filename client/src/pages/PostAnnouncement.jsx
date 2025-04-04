import { useState } from "react";
import ReactCalendar from "react-calendar";
import "../pages/styles/Admin.css";
import "react-calendar/dist/Calendar.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Announcement Posted:", { title, announcement, date: selectedDate });
    alert("Announcement posted successfully!");
    setTitle("");
    setAnnouncement("");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Left Side - Announcement Form */}
        <div className="announcement-form-container">
          <h2 className="section-title">Post an Announcement</h2>
          <form onSubmit={handleSubmit} className="announcement-form">
            <input
              type="text"
              placeholder="Enter announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
            />
            <textarea
              placeholder="Write your detailed announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              required
              className="textarea-field"
            ></textarea>
            <button type="submit" className="submit-btn">Post Announcement</button>
          </form>
        </div>

        {/* Right Side - Event Calendar */}
        <div className="calendar-container">
          <h2 className="section-title">Schedule Events</h2>
          <ReactCalendar
            onChange={handleDateChange}
            value={selectedDate}
            className="calendar"
          />
          <div className="calendar-footer">
            <span><strong>Selected Date: </strong>{selectedDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostAnnouncement;
