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
    </div>
  );
};

export default ManageMembership;
