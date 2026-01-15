import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../services/auth";
import "../styles/home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container">
      {/* 🔥 HERO SECTION */}
      <div className="home-hero card">
        <h1 className="home-title">Welcome to EBMS 🎟️</h1>

        <p className="home-subtitle">
          Your one-stop platform to discover events, book tickets,
          and manage everything seamlessly.
        </p>

        {/* 🔘 CTA BUTTONS (ROLE AWARE & CORRECT) */}
        <div className="home-actions">
          {/* 👤 NORMAL USER → Browse Events */}
          {!user?.is_organizer && (
            <Link to="/events" className="btn-primary">
              Browse Events
            </Link>
          )}

          {/* 👤 NORMAL USER → My Bookings */}
          {user && !user?.is_organizer && (
            <Link to="/bookings" className="btn-secondary">
              My Bookings
            </Link>
          )}

          {/* 🧑‍💼 ORGANIZER → My Events (PRIMARY CTA) */}
          {user?.is_organizer && (
            <Link to="/organizer/events" className="btn-primary">
              My Events
            </Link>
          )}

          {/* 🧑‍💼 ORGANIZER → MANAGEMENT ACTIONS */}
          {user?.is_organizer && (
            <>
              <Link to="/organizer/create-event" className="btn-secondary">
                Create Event
              </Link>
              <Link to="/organizer/dashboard" className="btn-secondary">
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* 🔔 ORGANIZER STATUS */}
        {user?.organizer_requested && !user?.is_organizer && (
          <div className="status-box status-warning">
            ⏳ Your organizer request is under review by the admin.
          </div>
        )}

        {user?.is_organizer && (
          <div className="status-box status-success">
            ✅ You are an approved organizer. You can now create and manage events.
          </div>
        )}
      </div>

      {/* ⭐ FEATURE HIGHLIGHTS */}
      <div className="home-features">
        <div className="card feature-card">
          <h3>🎭 Discover Events</h3>
          <p>
            Explore concerts, workshops, meetups, and more happening around you.
          </p>
        </div>

        <div className="card feature-card">
          <h3>🎟️ Book Tickets</h3>
          <p>
            Reserve your seats instantly with real-time availability updates.
          </p>
        </div>

        <div className="card feature-card">
          <h3>🧑‍💼 Manage Events</h3>
          <p>
            Organizers can create events, track bookings, and view analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
