import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

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
        setError("Failed to load organizer events");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) return <p>Loading your events...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Events (Organizer)</h2>

      {events.length === 0 && <p>No events created yet.</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: "15px" }}>
            <strong>{event.title}</strong><br />
            Date: {event.event_date}<br />
            Booked Seats: {event.booked_seats} / {event.total_seats}<br />

            <Link to={`/organizer/events/${event.id}`}>
              View Bookings
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrganizerEvents;
