import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../utils/auth";
import { getMe } from "../services/auth";

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
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      {isLoggedIn && (
        <>
          <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
          <Link to="/events" style={{ marginRight: "15px" }}>Events</Link>
          <Link to="/bookings" style={{ marginRight: "15px" }}>My Bookings</Link>

          {/* 🔐 Organizer/Admin only */}
          {(user?.is_organizer || user?.is_admin) && (
            <>
              <Link to="/organizer/create-event" style={{ marginRight: "15px" }}>
                Create Event
              </Link>
              <Link to="/organizer/events" style={{ marginRight: "15px" }}>
                Organizer
              </Link>
                <Link to="/organizer/dashboard" style={{ marginRight: "15px" }}>
                    Dashboard
              </Link>
            </>
          )}
        </>
      )}

      {!isLoggedIn && (
        <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>
      )}

      {isLoggedIn && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}

export default Navbar;
