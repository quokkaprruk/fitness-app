import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css"; // Import external CSS file
import Navbar from "../components/Navbar.jsx";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    try {
      // Send login request to backend
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          username,
          password,
        }
      );

      setMessage(`Success: ${response.data.message}`);
    } catch (error) {
      // Handle error response
      setMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="container">
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
        <button type="submit">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default LoginPage;
