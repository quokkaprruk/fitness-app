import React, { useState } from "react";
import "./styles/Membership.css";

const ManageMembership = () => {
  const membershipTiers = ["None", "Basic", "Standard", "Premium"];
  const [membership, setMembership] = useState("Premium");

  const handleUpgrade = () => {
    const currentIndex = membershipTiers.indexOf(membership);
    if (currentIndex < membershipTiers.length - 1) {
      setMembership(membershipTiers[currentIndex + 1]);
    }
  };

  const handleDowngrade = () => {
    const currentIndex = membershipTiers.indexOf(membership);
    if (currentIndex > 1) {
      setMembership(membershipTiers[currentIndex - 1]);
    }
  };

  const handleCancel = () => {
    setMembership("None");
  };

  const handleRejoin = () => {
    setMembership("Basic");
  };

  return (
    <div className="membership-container">
      <h2 className="manage-heading">Manage Your Membership</h2>
      <p className="manage-para">
        Current Plan: <strong>{membership}</strong>
      </p>

      {membership === "None" ? (
        <button className="upgrade-btn" onClick={handleRejoin}>
          Rejoin Membership
        </button>
      ) : (
        <div className="membership-buttons">
          {membership !== "Premium" && (
            <button className="upgrade-btn" onClick={handleUpgrade}>
              Upgrade Plan
            </button>
          )}
          {membership !== "Basic" && (
            <button className="downgrade-btn" onClick={handleDowngrade}>
              Downgrade Plan
            </button>
          )}
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel Membership
          </button>
        </div>
      )}

      <div className="manage-pricing-container">
        <div className="manage-pricing-grid">
          <div
            className={`pricing-card ${
              membership === "Basic" ? "selected" : ""
            }`}
          >
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
          </div>

          <div
            className={`manage-pricing-card ${
              membership === "Standard" ? "selected" : ""
            }`}
          >
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
          </div>

          <div
            className={`manage-pricing-card ${
              membership === "Premium" ? "selected" : ""
            }`}
          >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMembership;
