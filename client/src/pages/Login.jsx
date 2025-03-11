import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css";
import Navbar from "../components/Navbar.jsx";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/login`,
        { username, password }
      );
      setMessage(`Success: ${response.data.message}.`);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: response.data.username })
      );
      if (response.data.role === "member") {
        setTimeout(() => {
          navigate("/member");
        }, 1500);
      }
      else if (response.data.role === "trainer") {
        setTimeout(() => {
          navigate("/trainer");
        }, 1500);
      }
      else if (response.data.role === "admin") {
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
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
        { email }
      );

      setMessage(response.data.message || "Reset link sent! Check your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset link.");
    }
  };

  return (
    <div className="login-container">
      <Navbar isLoggedIn={false} />
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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="login-btn" type="submit">Login</button>
      </form>
      <p className="forgot-password" onClick={() => setShowReset(!showReset)}>Forgot Password?</p>
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
          <button className="reset-btn" type="submit">Send Reset Email</button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default LoginPage;
