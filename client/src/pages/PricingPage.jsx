import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PricingPage.css";

const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pricing-container">
      <h2>Membership Plans</h2>
      <div className="plans">
        <div className="plan">
          <h3>Basic</h3>
          <p>$10/month</p>
          <button onClick={() => navigate("/register")} className="select-button">Select</button>
        </div>
        <div className="plan">
          <h3>Premium</h3>
          <p>$20/month</p>
          <button onClick={() => navigate("/register")} className="select-button">Select</button>
        </div>
        <div className="plan">
          <h3>VIP</h3>
          <p>$30/month</p>
          <button onClick={() => navigate("/register")} className="select-button">Select</button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
