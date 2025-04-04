import { useState } from "react";
import "../pages/styles/Admin.css";

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Announcement Posted:", announcement);
    alert("Announcement posted successfully!");
    setAnnouncement("");
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