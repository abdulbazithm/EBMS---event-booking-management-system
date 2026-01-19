import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tickets, setTickets] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // 🔁 Fetch event details
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

  // 🧠 EVENT STATUS LOGIC
  const isPastEvent = event
    ? new Date(`${event.event_date}T${event.event_time}`) < new Date()
    : false;

  const isSoldOut = event ? event.available_seats === 0 : false;

  // 🟢🟡🔴 STATUS CONFIG
  const getStatus = () => {
    if (isPastEvent) {
      return { text: "Event Over", color: "#d32f2f" };
    }
    if (isSoldOut) {
      return { text: "Sold Out", color: "#f9a825" };
    }
    return { text: "Upcoming", color: "#2e7d32" };
  };

  const status = getStatus();

  const handleBooking = async () => {
    if (bookingLoading || isPastEvent || isSoldOut) return;

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
      setTickets(1);
      fetchEvent();
    } catch (err) {
      const data = err.response?.data;
      let message = "Booking failed. Please try again.";

      if (data?.non_field_errors?.[0]) {
        const backendMsg = data.non_field_errors[0].toLowerCase();

        if (backendMsg.includes("already booked")) {
          message = "You have already booked this event.";
        } else if (backendMsg.includes("ended")) {
          message = "This event is over. Past events cannot be booked.";
        } else if (backendMsg.includes("seat")) {
          message = "Not enough seats available.";
        } else {
          message = data.non_field_errors[0];
        }
      }

      setBookingError(`❌ ${message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      {/* 🔴🟡🟢 STATUS BAR */}
      <div
        style={{
          backgroundColor: status.color,
          color: "white",
          padding: "8px",
          textAlign: "center",
          fontWeight: "bold",
          borderRadius: "6px",
          marginBottom: "15px",
        }}
      >
        {status.text}
      </div>

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
        <strong>Description:</strong>
        <br />
        {event.description}
      </p>

      <hr />

      {/* 🎟️ Ticket Counter */}
      <label>
        <strong>Tickets:</strong>
        <input
          type="number"
          min="1"
          max={event.available_seats}
          value={tickets}
          disabled={bookingLoading || isPastEvent || isSoldOut}
          onChange={(e) => setTickets(Number(e.target.value))}
          style={{ marginLeft: "10px", width: "70px" }}
        />
      </label>

      <br />
      <br />

      {/* 🎟️ Book Button */}
      <button
        onClick={handleBooking}
        disabled={bookingLoading || isPastEvent || isSoldOut}
      >
        {isPastEvent
          ? "Event Over"
          : isSoldOut
          ? "Sold Out"
          : bookingLoading
          ? "Booking..."
          : "Book Tickets"}
      </button>

      {/* 🔔 Messages */}
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
