import { useLocation, useNavigate } from "react-router-dom";
import "./styles/PaymentResult.css";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");
  const isSuccess = sessionId ? true : false;
  // const isSuccess = location.pathname === "/success";

  return (
    <div>
      {isSuccess ? (
        <div className="payment-container">
          <div className="wrapper">
            <div className="success-banner-image"></div>
            <h2>Payment Successful!</h2>
            <p>
              Thank you for subscribing to our <br />
              membership plan.
            </p>
          </div>
          <div className="button-wrapper">
            <button
              className="btn fill"
              id="back"
              onClick={() => navigate("/")}
            >
              Back to Home Page
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-container">
          <div className="wrapper">
            <div className="cancel-banner-image"></div>
            <h2>Payment Declined</h2>
            <p>
              Your payment could not be processed. <br /> Please try again.
            </p>
          </div>
          <div className="button-wrapper">
            <button
              className="btn fill"
              id="back"
              onClick={() => navigate("/pricing")}
            >
              Back to Subscription Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
