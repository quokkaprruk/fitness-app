import React, { useState } from "react";
import axios from "axios";
import "./styles/SignUp.css";
import Navbar from "../components/Navbar.jsx";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/signup`,
        formData
      )
      .then((response) => setMessage("Sign-up successful!"))
      .catch((error) => setMessage("Sign-up failed: " + error.message));
  };

  return (
    <div className="sign-up-container">
      <Navbar isLoggedIn={false} />
      <div className="navbar-spacer"></div>
      <h2 className="signup-heading">Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignUpPage;
