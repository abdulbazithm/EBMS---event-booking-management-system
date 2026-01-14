import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    register_as_organizer: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        register_as_organizer: formData.register_as_organizer,
      };

      console.log("REGISTER PAYLOAD:", payload); // 🔥 DEBUG

      await api.post("/accounts/register/", payload);

      alert(
        formData.register_as_organizer
          ? "Organizer request submitted for approval."
          : "Registration successful. Please login."
      );

      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="register_as_organizer"
            checked={formData.register_as_organizer}
            onChange={handleChange}
          />
          Register as Organizer (admin approval required)
        </label>

        <br /><br />

        <button disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
