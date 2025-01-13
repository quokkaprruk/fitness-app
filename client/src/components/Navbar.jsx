import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>ISGA Gym</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/reservation" className="navbar-link">
            Reservation
          </Link>
        </li>
        <li>
          <Link to="/classes" className="navbar-link">
            Classes
          </Link>
        </li>
        <li>
          <Link to="/community" className="navbar-link">
            Community
          </Link>
        </li>
        <li>
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
        </li>
      </ul>
      <div className="navbar-auth">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
