import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";


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

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Available Events</h2>

      {events.length === 0 && <p>No events found.</p>}

      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>
              <strong>{event.title}</strong>
            </Link>
            <br />
            {event.date} {event.location && `| ${event.location}`}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Events;
