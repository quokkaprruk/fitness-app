import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCog, FaUser } from "react-icons/fa";
import "../pages/styles/Navbar.css";
import logo from "../logo.png";

const Navbar = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

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
            <Link to="/settings">
              <FaCog className="icon" title="Settings" />
            </Link>
            <div className="profile-dropdown">
              <FaUser
                className="icon"
                title="Profile"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <a href="/logout" className="dropdown-item">
                    Logout
                  </a>
                </div>
              )}
            </div>
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
