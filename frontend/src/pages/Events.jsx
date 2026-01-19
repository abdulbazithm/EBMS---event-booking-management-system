import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming"); // 🆕 filter state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/");
        setEvents(response.data.results || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const now = new Date();

  // 🧠 FILTER LOGIC
  const filteredEvents = events.filter((event) => {
    const eventDateTime = new Date(
      `${event.event_date}T${event.event_time}`
    );

    if (filter === "upcoming") {
      return eventDateTime >= now;
    }

    if (filter === "past") {
      return eventDateTime < now;
    }

    return true;
  });

  if (loading) return <p className="text-center">Loading events...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-20">🎟️ Events</h2>

      {/* 🔘 FILTER TABS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("upcoming")}
          style={{
            marginRight: "10px", background:"green",
            fontWeight: filter === "upcoming" ? "bold" : "normal",
          }}
        >
          Upcoming Events
        </button>

        <button
          onClick={() => setFilter("past")}
          style={{
            background:"#6a1b9a", fontWeight: filter === "past" ? "bold" : "normal",
          }}
        >
          Past Events
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => {
            const isPastEvent =
              new Date(`${event.event_date}T${event.event_time}`) < now;

            const isSoldOut = event.available_seats === 0;

            let statusText = "Upcoming";
            let statusClass = "status-upcoming";

            if (isPastEvent) {
              statusText = "Event Over";
              statusClass = "status-over";
            } else if (isSoldOut) {
              statusText = "Sold Out";
              statusClass = "status-soldout";
            }

            return (
              <div className="card event-card" key={event.id}>
                <div className="event-poster">
                  <span className={`event-status ${statusClass}`}>
                    {statusText}
                  </span>
                </div>

                <div className="event-content">
                  <h3>{event.title}</h3>
                  <p>📅 {event.event_date}</p>
                  {event.location && <p>📍 {event.location}</p>}
                  <p className="seats">
                    Seats Available:{" "}
                    <strong>{event.available_seats}</strong>
                  </p>
                </div>

                <Link to={`/events/${event.id}`} className="event-cta">
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
