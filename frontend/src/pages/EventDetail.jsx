import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState(1);          // 🎟️ seat counter
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
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

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (tickets < 1) {
      setBookingMsg("❌ Please select at least 1 ticket.");
      return;
    }

    if (tickets > event.available_seats) {
      setBookingMsg("❌ Not enough seats available.");
      return;
    }

    setBookingLoading(true);
    setBookingMsg("");

    try {
      await api.post("/bookings/create/", {
        event: Number(id),
        tickets: tickets, // ✅ dynamic ticket count
      });

      setBookingMsg("🎉 Booking successful!");
    } catch (err) {
      setBookingMsg("❌ Booking failed or already booked.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div>
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
          onChange={(e) => setTickets(Number(e.target.value))}
          style={{ marginLeft: "10px", width: "70px" }}
        />
      </label>

      <br /><br />

      {/* BOOK BUTTON */}
      <button
        onClick={handleBooking}
        disabled={bookingLoading || event.available_seats === 0}
      >
        {bookingLoading ? "Booking..." : "Book Tickets"}
      </button>

      {bookingMsg && <p>{bookingMsg}</p>}
    </div>
  );
}

export default EventDetail;
