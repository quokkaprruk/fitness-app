import React, { useContext } from "react";
import axios from "axios";
import "./styles/Membership.css";
import { MembershipContext } from "../context/MembershipContext";

const ManageMembership = () => {
  const { membership, setMembership } = useContext(MembershipContext);

  // Reused from PricingPage.js
  const handleCheckout = async (planName, price) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment/checkout`,
        { plan_name: planName, price }
      );

      console.log({ data: response.data });
      if (response.data?.session?.url) {
        window.location.href = response.data.session.url;
      } else {
        alert("Error starting checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment failed, Server Error");
    }
  };

  const membershipTiers = [
    { name: "None", price: 0 },
    { name: "Basic", price: 0 },
    { name: "Standard", price: 20 }, // $20
    { name: "Premium", price: 30 }, // $30
  ];

  const handleUpgrade = () => {
    const currentIndex = membershipTiers.findIndex(tier => tier.name === membership);
    if (currentIndex < membershipTiers.length - 1) {
      const newTier = membershipTiers[currentIndex + 1];
      setMembership(newTier.name);
      if (newTier.price > 0) {
        handleCheckout(newTier.name, newTier.price); // Trigger Stripe checkout
      }
    }
  };

  const handleDowngrade = () => {
    const currentIndex = membershipTiers.findIndex(tier => tier.name === membership);
    if (currentIndex > 1) {
      const newTier = membershipTiers[currentIndex - 1];
      setMembership(newTier.name);
      if (newTier.price > 0) {
        handleCheckout(newTier.name, newTier.price); // Trigger Stripe checkout
      }
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
            <p>$0/month</p>
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
            className={`pricing-card ${
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
              <li>1 Free guest pass per month</li>
            </ul>
          </div>

          <div
            className={`pricing-card ${
              membership === "Premium" ? "selected" : ""
            }`}
          >
            <h3>Premium</h3>
            <p>$30/month</p>
            <ul>
              <li>All Standard benefits</li>
              <li>Virtual trainer consultations</li>
              <li>Unlimited fitness plans</li>
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
