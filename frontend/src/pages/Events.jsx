import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../styles/events.css"; 

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="text-center">Loading events...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-20">🎟️ Available Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div className="card event-card" key={event.id}>
              {/* Poster / Banner */}
              <div className="event-poster">
                
              </div>

              {/* Content */}
              <div className="event-content">
                <h3>{event.title}</h3>

                <p>📅 {event.event_date || event.date}</p>

                {event.location && (
                  <p>📍 {event.location}</p>
                )}

                <p className="seats">
                  Seats Available:{" "}
                  <strong>{event.available_seats}</strong>
                </p>
              </div>

              {/* CTA */}
              <Link
                to={`/events/${event.id}`}
                className="event-cta"
              >
                View & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
