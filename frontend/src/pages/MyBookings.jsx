import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/");
      setBookings(response.data.results || []);
    } catch (err) {
      console.error("MY BOOKINGS ERROR:", err.response);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setCancelLoading(bookingId);

    try {
      await api.post(`/bookings/bookings/${bookingId}/cancel/`);
      // Refresh list after cancel
      fetchBookings();
    } catch (err) {
      console.error("CANCEL BOOKING ERROR:", err.response);
      alert("Failed to cancel booking");
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.length === 0 && <p>You have no bookings yet.</p>}

      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} style={{ marginBottom: "20px" }}>
            <strong>Event ID:</strong> {booking.event}
            <br />
            <strong>Event:</strong> {booking.event_title}
            <br />
            <strong>Tickets:</strong> {booking.tickets}
            <br />
            <strong>Status:</strong> {booking.status}
            <br />
            <strong>Booked At:</strong>{" "}
            {new Date(booking.booking_time).toLocaleString()}
            <br />

            {booking.status === "BOOKED" && (
              <button
                onClick={() => handleCancel(booking.id)}
                disabled={cancelLoading === booking.id}
                style={{ marginTop: "5px" }}
              >
                {cancelLoading === booking.id ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyBookings;
