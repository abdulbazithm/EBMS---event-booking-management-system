import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../utils/auth";
import { getMe } from "../services/auth";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const [user, setUser] = useState(null);

  // 🔹 Fetch logged-in user role
  useEffect(() => {
    if (isLoggedIn) {
      getMe()
        .then(setUser)
        .catch(() => {
          logout();
          navigate("/login");
        });
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* 🔴 LOGO */}
        <Link to="/" className="navbar-logo">
          🎟️ EBMS
        </Link>

        {/* 🔗 LINKS */}
        <div className="navbar-links">
          {isLoggedIn && (
            <>
              <Link to="/">Home</Link>

              {/* 👤 NORMAL USER */}
              {!user?.is_organizer && (
                <>
                  <Link to="/events">Events</Link>
                  <Link to="/bookings">My Bookings</Link>
                </>
              )}

              {/* 🧑‍💼 ORGANIZER */}
              {user?.is_organizer && (
                <>
                  <Link to="/organizer/events">My Events</Link>
                  <Link to="/organizer/create-event">Create Event</Link>
                  <Link to="/organizer/dashboard">Dashboard</Link>
                </>
              )}
            </>
          )}

          {!isLoggedIn && <Link to="/login">Login</Link>}

          {isLoggedIn && (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
