import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/PricingPage.css";
import Navbar from "../components/Navbar.jsx";


const PricingPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar isLoggedIn={false} />
      <div className="navbar-spacer"></div>
      <h2 className="membership-heading">Membership Plans</h2>
      <div className="pricing-container">
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <p>$10/month</p>
            <ul>
              <li>Off-peak gym access</li>
              <li>Standard equipment usage</li>
              <li>One personalized fitness plan</li>
              <li>Fitness tracking app access</li>
              <li>Goal tracking</li>
              <li>Real-time chat with trainers</li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="pricing-button"
            >
              Select
            </button>
          </div>

          <div className="pricing-card">
            <h3>Standard</h3>
            <p>$20/month</p>
            <ul>
              <li>All Basic benefits</li>
              <li>Full day access</li>
              <li>Group fitness classes</li>
              <li>Monthly progress reports</li>
              <li>Two fitness plans</li>
              <li>Equipment reservation</li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="pricing-button"
            >
              Select
            </button>
          </div>

          <div className="pricing-card">
            <h3>Premium</h3>
            <p>$30/month</p>
            <ul>
              <li>All Standard benefits</li>
              <li>Virtual trainer consultations</li>
              <li>Unlimited fitness plans</li>
              <li>Premium fitness classes</li>
              <li>Monthly goal tracking reviews</li>
              <li>Free guest passes</li>
              <li>Exclusive wellness events</li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className="pricing-button"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
