import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/create-event.css";

function CreateEvent() {
  const navigate = useNavigate();

  // 🔹 Categories
  const [categories, setCategories] = useState([]);

  // 🔹 Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    event_date: "",
    event_time: "",
    total_seats: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/events/categories/");
        setCategories(response.data.results || []);
      } catch (err) {
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/events/create/", {
        ...formData,
        category: Number(formData.category),
        total_seats: Number(formData.total_seats),
      });

      navigate("/organizer/events");
    } catch (err) {
      setError("Failed to create event. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card create-event-card">
        <h2 className="mb-20">🧑‍💼 Create New Event</h2>

        {error && <p className="text-error">{error}</p>}

        <form onSubmit={handleSubmit} className="create-event-form">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Date & Time */}
          <div className="form-row">
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="event_time"
              value={formData.event_time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Seats */}
          <input
            type="number"
            name="total_seats"
            placeholder="Total Seats"
            value={formData.total_seats}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
