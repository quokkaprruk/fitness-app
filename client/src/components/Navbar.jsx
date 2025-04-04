import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/styles/Navbar.css";
import logo from "../logo.png";
import { FaSignOutAlt, FaUser, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "../context/authContextValue";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const toggleLoginDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Non authenticated users
  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="navbar-welcome">Welcome!</div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/classes">Classes</Link>
          <Link to="/contact">Contact</Link>
          <div className="auth-buttons">
            <Link to="/login" className="btn login-btn">
              Login
            </Link>
            <Link to="/signup" className="btn signup-btn">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
    );
  }

  // Admin users
  // Admin users
  if (user && user.role === "admin") {
    return (
      <nav className="navbar">
        <div className="navbar-welcome">Welcome, {user.username}!</div>
        <div className="navbar-links">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/create-trainer">Create Trainer</Link>
          <Link to="/admin/create-admin">Create Admin</Link>
          <Link to="/admin/post-announcement">Post Announcement</Link>
          <Link to="/community">Community</Link>
          <Link to="/contact">Contact</Link>

          <div className="profile-dropdown">
            <FaUser
              className="icon"
              title="Profile"
              onClick={toggleLoginDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/manage-membership" className="dropdown-item">
                  Manage Membership
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
    );
  }
  if (user && user.role === "admin") {
    return (
      <nav className="navbar">
        <div className="navbar-welcome">Welcome, {user.username}!</div>
        <div className="navbar-links">
          <Link to="/admin">Dashboard</Link>

          <div
            className="dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="dropdown-title">Create Profile</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/admin/create-trainer" className="dropdown-item">
                  Create Trainer
                </Link>
                <Link to="/admin/create-admin" className="dropdown-item">
                  Create Admin
                </Link>
              </div>
            )}
          </div>

          <Link to="/admin/post-announcement">Post Announcement</Link>
          <Link to="/community">Community</Link>
          <Link to="/contact">Contact</Link>

          <div className="profile-dropdown">
            <FaUser
              className="icon"
              title="Profile"
              onClick={toggleLoginDropdown}
            />
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
    );
  }


  // Trainers
  if (user && user.role === "trainer") {
    return (
      <nav className="navbar">
        <div className="navbar-welcome">Welcome, {user?.username}</div>
        <div className="navbar-links">
          <Link to="/trainer">Home</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/community">Community</Link>
          <div className="profile-dropdown">
            <FaUser
              className="icon"
              title="Profile"
              onClick={toggleLoginDropdown}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <div className="dropdown-item" onClick={handleLogout}>
                  <FaSignOutAlt className="icon" /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
    );
  }

  // For authenticated users
  return (
    <nav className="navbar">
      <div className="navbar-welcome">Welcome, {user.username}!</div>
      <div className="navbar-links">
        <Link to="/member">Home</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/community">Community</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/upcoming">Upcoming</Link>
        <div className="profile-dropdown">
          <FaUser
            className="icon"
            title="Profile"
            onClick={toggleLoginDropdown}
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/manage-membership" className="dropdown-item">
                Manage Membership
              </Link>
              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt className="icon" /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
    </nav>
  );
};

export default Navbar;