import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css";
import { AuthContext } from "../context/authContextValue.js";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useContext(AuthContext);

  // Check if the user is already logged in, and redirect them if so.
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "member") {
        navigate("/member");
      } else if (user.role === "trainer") {
        navigate("/trainer");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/login`,
        { username, password },
      );
      setMessage(`Success: ${response.data.message}.`);
      // Use the AuthContext login function to store token and update context
      login(response.data.token);
      // Redirect based on user role
      if (response.data.role === "member") {
        setTimeout(() => navigate("/member"), 1500);
      } else if (response.data.role === "trainer") {
        setTimeout(() => navigate("/trainer"), 1500);
      } else if (response.data.role === "admin") {
        setTimeout(() => navigate("/admin"), 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/forgot-password`,
        { email },
      );
      setMessage(response.data.message || "Reset link sent! Check your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset link.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-nav-spacer">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password:</label>
          <input className="password-input"
          type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
      <p className="forgot-password" onClick={() => setShowReset(!showReset)}>
        Forgot Password?
      </p>
      {showReset && (
        <form onSubmit={handleResetPassword} className="reset-form">
          <h3>Reset Password</h3>
          <div className="inputGroup">
            <label htmlFor="email">Enter your email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="reset-btn" type="submit">
            Send Reset Email
          </button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
    </div>
  );
};

export default LoginPage;
