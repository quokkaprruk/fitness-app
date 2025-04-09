// import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";
import { useContext } from "react";
import axios from "axios";
import "./styles/PricingPage.css";

const PricingPage = () => {
  const { token, user } = useContext(AuthContext);
  const handleCheckout = async (planName, price) => {
    try {
      // Send POST request with axios
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/api/payment/checkout`,
        { user, plan_name: planName, price }
      );

      // Log the response to see what data is returned
      console.log({ data: response.data });
      // If the URL is available, redirect the user to Stripe Checkout page
      if (response.data) {
        window.location.href = response.data?.session?.url;
      } else {
        alert("Error starting checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment failed, Server Error");
    }
  };
  return (
    <div>
      <div className="pricing-navbar-spacer"></div>
      <h2 className="plans-heading">Membership Plans</h2>
      <div className="pricing-container">
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <p>Free</p>
            <ul>
              <li>Off-peak gym access</li>
              <li>Standard equipment usage</li>
              <li>One personalized fitness plan</li>
              <li>Fitness tracking app access</li>
              <li>Goal tracking</li>
              <li>Real-time chat with trainers</li>
            </ul>
            <button
              onClick={() => handleCheckout("free", 0)} //call the post backend with name: basic and price 10
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
              onClick={() => handleCheckout("standard", 20)} //call the post backend with name: standard and price 20
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
              onClick={() => handleCheckout("premium", 30)} //call the post backend with name: premium and price 30
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
