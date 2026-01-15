import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/organizer-bookings.css";

function OrganizerEventBookings() {
  const { id } = useParams();
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
        setError("Failed to load bookings for this event");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id]);

  if (loading) return <p className="text-center">Loading event bookings...</p>;
  if (error) return <p className="text-center text-error">{error}</p>;

  return (
    <div className="container">
      <Link to="/organizer/events" className="mb-20" id="back-events">
        ← Back to My Events
      </Link>

      <h2 className="mb-20">📋 Event Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings for this event yet.</p>
      ) : (
        <div className="organizer-booking-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="card booking-card">
              <p>
                <strong>User:</strong> {booking.user.username}
              </p>
              <p>
                <strong>Email:</strong> {booking.user.email}
              </p>
              <p>
                <strong>Tickets:</strong> {booking.tickets}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    booking.status === "BOOKED"
                      ? "status-active"
                      : "status-cancelled"
                  }
                >
                  {booking.status}
                </span>
              </p>
              <p className="booking-time">
                {new Date(booking.booking_time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrganizerEventBookings;
