import { useState } from "react";
import ReactCalendar from "react-calendar";
import "../pages/styles/Admin.css";
import "react-calendar/dist/Calendar.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnnouncement = { title, announcement, date: selectedDate };

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnnouncement),
      });

      if (response.ok) {
        alert("Announcement posted successfully!");
        setTitle("");
        setAnnouncement("");
      } else {
        alert("Failed to post announcement. Try again.");
      }
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("An error occurred while posting the announcement.");
    }
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
