import React, { useState } from "react";
import "./styles/Membership.css";

const ManageMembership = () => {
  const [membership, setMembership] = useState("Premium");
  const [isCancelled, setIsCancelled] = useState(false);

  const handleCancel = () => {
    setMembership("None");
    setIsCancelled(true);
  };

  const handleUpgrade = () => {
    setMembership("Premium");
    setIsCancelled(false);
  };

  return (
    <div className="membership-container">
      <h2>Manage Your Membership</h2>
      <p>Current Plan: <strong>{membership}</strong></p>

      {!isCancelled ? (
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel Membership
        </button>
      ) : (
        <button className="upgrade-btn" onClick={handleUpgrade}>
          Rejoin Membership
        </button>
      )}
    </div>
  );
};

export default ManageMembership;
