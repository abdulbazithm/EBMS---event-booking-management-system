import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/bookings.css"; // ✅ page styles

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelLoading, setCancelLoading] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

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
    if (cancelLoading) return;

    setCancelLoading(bookingId);
    setError("");
    setSuccessMsg("");

    try {
      await api.post(`/bookings/bookings/${bookingId}/cancel/`);
      setSuccessMsg("✅ Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      setError("❌ Failed to cancel booking.");
    } finally {
      setCancelLoading(null);
    }
  };

  if (loading) return <p className="text-center">Loading your bookings...</p>;
  if (error && bookings.length === 0)
    return <p className="text-center text-error">{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-20">🎟️ My Bookings</h2>

      {successMsg && <p className="text-success">{successMsg}</p>}
      {error && <p className="text-error">{error}</p>}

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div className="card booking-card" key={booking.id}>
              <h3 className="booking-title">
                {booking.event_title}
              </h3>

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
                <strong>Booked At:</strong>{" "}
                {new Date(booking.booking_time).toLocaleString()}
              </p>

              {booking.status === "BOOKED" && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancelLoading === booking.id}
                  className="mt-10"
                >
                  {cancelLoading === booking.id
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
