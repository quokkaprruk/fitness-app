//navbar for new user and registered user

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../logo.png";
import { FaCog, FaUser } from "react-icons/fa";
import LoginPage from "../pages/Login.jsx";

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="navbar-welcome">Welcome!</div>
      <div className="navbar-links">
        <a href="/contact">Contact</a>
        <a href="/reservations">Reservations</a>
        <a href="/community">Community</a>
        <Link to="/classes" className="btn classes-btn">
          Classes
        </Link>
        {isLoggedIn ? (
          <>
            <a href="/member">Home</a>
            <a href="/progress">Progress</a>
            <FaCog className="icon" title="Settings" />
            <FaUser className="icon" title="Profile" />
          </>
        ) : (
          <>
            <a href="/">Home</a>
            <div className="auth-buttons">
              <Link to="/login" className="btn login-btn">
                Login
              </Link>
              <Link to="/signup" className="btn signup-btn">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
    </nav>
  );
};

export default Navbar;
