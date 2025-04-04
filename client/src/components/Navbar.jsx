import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          FitFam
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/classes">Classes</Link>
          </li>
          <li>
            <Link to="/upcoming">Upcoming</Link>
          </li>
          <li>
            <Link to="/community">Community</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>

          {isAuthenticated ? (
            <>
              {user?.role === "member" && (
                <>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/progress">Progress</Link>
                  </li>
                  <li>
                    <Link to="/manage-membership">Membership</Link>
                  </li>
                </>
              )}

              {user?.role === "trainer" && (
                <>
                  <li>
                    <Link to="/trainer">Trainer Dashboard</Link>
                  </li>
                </>
              )}

              {user?.role === "admin" && (
                <li className="nav-item dropdown">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="dropdown-toggle"
                  >
                    Admin Options
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/admin">Admin Dashboard</Link>
                      </li>
                      <li>
                        <Link to="/admin/create-trainer">Create Trainer</Link>
                      </li>
                      <li>
                        <Link to="/admin/create-admin">Create Admin</Link>
                      </li>
                      <li>
                        <Link to="/admin/post-announcement">
                          Post Announcement
                        </Link>
                      </li>
                      <li>
                        <Link to="/genSchedule">Generate Schedule</Link>
                      </li>
                    </ul>
                  )}
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="nav-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
