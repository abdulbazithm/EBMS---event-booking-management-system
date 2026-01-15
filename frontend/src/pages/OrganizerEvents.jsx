import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/organizer-events.css";

function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await api.get("/events/organizer/my-events/");
        setEvents(response.data.results || response.data);
      } catch (err) {
        setError("Failed to load your events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) return <p className="text-center">Loading your events...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-20">🧑‍💼 My Events</h2>

      {events.length === 0 ? (
        <p>You haven’t created any events yet.</p>
      ) : (
        <div className="organizer-event-grid">
          {events.map((event) => (
            <div key={event.id} className="card organizer-event-card">
              <h3>{event.title}</h3>

              <p>📅 {event.event_date}</p>

              <p className="seats">
                Seats Booked:{" "}
                <strong>
                  {event.booked_seats} / {event.total_seats}
                </strong>
              </p>

              <Link
                to={`/organizer/events/${event.id}`}
                className="event-cta"
              >
                View Bookings
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizerEvents;
