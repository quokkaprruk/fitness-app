import React from "react";
import "./CommunityPage.css";

const CommunityPage = () => {
  return (
    <div className="community-container">
      <h1>🏋️‍♀️ FitFam Community</h1>
      <p className="coming-soon-text">Coming Soon: Exciting features to connect and grow together! 🚀</p>
      <div className="feature-preview">
        <ul>
          <li> Announcements from Admin</li>
          <li> Daily Fitness Challenges</li>
          <li> Community Polls</li>
          <li> Health Tips of the Day</li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityPage;
