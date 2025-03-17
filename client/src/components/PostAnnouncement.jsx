import { useState } from "react";
import "../pages/styles/Admin.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: announcement }),
      });

      if (!response.ok) throw new Error("Failed to post announcement");

      const data = await response.json();
      console.log("Announcement Posted:", data);
      alert("Announcement posted successfully!");
      setAnnouncement("");
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("Failed to post announcement.");
    }
  };

  return (
    <div className="admin-page">
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
  );
};

export default PostAnnouncement;
