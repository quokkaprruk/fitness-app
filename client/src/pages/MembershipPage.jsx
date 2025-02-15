import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/MembershipPage.css";
import Navbar from "../components/Navbar.jsx";
import MainImg from "../memberPagePic.png";

const MembershipPage = () => {
  const navigate = useNavigate();

  return (
    <div className="membership-page"
    style={{
      backgroundImage: `url(${MainImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
    }}
    >
      <Navbar isLoggedIn={false} />
      <h2 className="membership-heading">Become a Member</h2>
      <div className="membership-container">
        <p><strong>Enjoy exclusive benefits and access to premium classes.</strong></p>
        <div className="membership-buttons">
          <button
            onClick={() => navigate("/pricing")}
            className="membership-button"
          >
            Join Now
          </button>
          <button
            onClick={() => navigate("/")}
            className="membership-button"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
