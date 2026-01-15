import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState(1); // 🎟️ ticket counter
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // 🔁 Fetch event details (reusable)
  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}/`);
      setEvent(response.data);
    } catch (err) {
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (bookingLoading) return; // 🛡️ double-click protection

    setBookingError("");
    setBookingSuccess("");

    if (tickets < 1) {
      setBookingError("❌ Please select at least 1 ticket.");
      return;
    }

    if (tickets > event.available_seats) {
      setBookingError("❌ Not enough seats available.");
      return;
    }

    setBookingLoading(true);

    try {
      await api.post("/bookings/create/", {
        event: Number(id),
        tickets: tickets,
      });

      setBookingSuccess("🎉 Booking successful!");
      setTickets(1); // reset counter
      fetchEvent();  // 🔁 refresh seats
    } catch (err) {
      setBookingError(
        err.response?.data?.detail ||
        "❌ Booking failed or already booked."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      <h2>{event.title}</h2>

      <p>
        <strong>Date:</strong> {event.event_date} <br />
        <strong>Time:</strong> {event.event_time}
      </p>

      <p>
        <strong>Location:</strong> {event.location}
      </p>

      <p>
        <strong>Available Seats:</strong> {event.available_seats}
      </p>

      <p>
        <strong>Description:</strong><br />
        {event.description}
      </p>

      <hr />

      {/* 🎟️ TICKET COUNTER */}
      <label>
        <strong>Tickets:</strong>
        <input
          type="number"
          min="1"
          max={event.available_seats}
          value={tickets}
          disabled={bookingLoading}
          onChange={(e) => setTickets(Number(e.target.value))}
          style={{ marginLeft: "10px", width: "70px" }}
        />
      </label>

      <br /><br />

      {/* 🎟️ BOOK BUTTON */}
      <button
        onClick={handleBooking}
        disabled={bookingLoading || event.available_seats === 0}
      >
        {bookingLoading ? "Booking..." : "Book Tickets"}
      </button>

      {/* 🔔 INLINE MESSAGES */}
      {bookingError && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {bookingError}
        </p>
      )}

      {bookingSuccess && (
        <p style={{ color: "green", marginTop: "10px" }}>
          {bookingSuccess}
        </p>
      )}
    </div>
  );
}

export default EventDetail;
