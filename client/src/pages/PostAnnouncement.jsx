import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../pages/styles/Admin.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: ""
  });
  const { authToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(announcement)
      });

      if (!response.ok) throw new Error("Failed to post announcement");
      
      alert("Announcement posted successfully!");
      setAnnouncement({ title: "", message: "" });
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("Failed to post announcement");
    }
  };

  return (
    <div className="admin-page">
      <h2>Post an Announcement</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
    </div>
  );
};

export default PostAnnouncement;