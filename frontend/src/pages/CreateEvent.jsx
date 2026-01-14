import { useEffect, useState } from "react";   // 🔹 useEffect added for fetching categories
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateEvent() {
  const navigate = useNavigate();

  //  State to store categories from backend
  const [categories, setCategories] = useState([]);


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",       //  Will store selected category ID
    event_date: "",
    event_time: "",
    total_seats: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/events/categories/");
        // 🔹 IMPORTANT FIX: use response.data.results (pagination-safe)
        setCategories(response.data.results || []);
      } catch (err) {
        console.error("CATEGORY FETCH ERROR:", err.response);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Handles all input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Submit form → create event
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/events/create/", {
        ...formData,
        // 🔹 Backend expects numbers for FK & seats
        category: Number(formData.category),
        total_seats: Number(formData.total_seats),
      });

      alert("🎉 Event created successfully!");
      navigate("/organizer/events"); // redirect to organizer events
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err.response?.data);
      setError("Failed to create event. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Event Title */}
        <div>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* 🔹 UPDATED: CATEGORY DROPDOWN (instead of manual ID input) */}
        <div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>

            {/* 🔹 Populate dropdown dynamically */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Date */}
        <div>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Event Time */}
        <div>
          <input
            type="time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            required
          />
        </div>

        {/* Total Seats */}
        <div>
          <input
            type="number"
            name="total_seats"
            placeholder="Total Seats"
            value={formData.total_seats}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
