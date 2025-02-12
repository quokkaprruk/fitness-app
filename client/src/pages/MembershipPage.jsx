import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/MembershipPage.css";

const MembershipPage = () => {
  const navigate = useNavigate();

  return (
    <div className="membership-container">
      <h2>Become a Member</h2>
      <p>Enjoy exclusive benefits and access to premium classes.</p>
      <button onClick={() => navigate("/pricing")} className="join-button">
        Join Now
      </button>
      <button onClick={() => navigate("/")} className="skip-button">
        Skip for Now
      </button>
    </div>
  );
};

export default MembershipPage;
