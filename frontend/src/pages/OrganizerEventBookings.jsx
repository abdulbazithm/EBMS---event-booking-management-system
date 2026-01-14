import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function OrganizerEventBookings() {
  const { id } = useParams(); // event-id
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(
          `/bookings/organizer/events/${id}/bookings/`
        );
        setBookings(response.data.results || response.data);
      } catch (err) {
        console.error("ORGANIZER BOOKINGS ERROR:", err.response);
        setError("Failed to load bookings for this event");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  if (loading) return <p>Loading event bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Event Bookings (Organizer)</h2>

      <Link to="/organizer/events">← Back to My Events</Link>

      <br /><br />

      {bookings.length === 0 && <p>No bookings for this event.</p>}

      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} style={{ marginBottom: "15px" }}>
            <strong>User:</strong> {booking.user.username} <br />
            <strong>Email:</strong> {booking.user.email} <br />
            <strong>Tickets:</strong> {booking.tickets} <br />
            <strong>Status:</strong> {booking.status} <br />
            <strong>Booked At:</strong>{" "}
            {new Date(booking.booking_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrganizerEventBookings;
