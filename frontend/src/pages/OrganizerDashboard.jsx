import { useEffect, useState } from "react";
import api from "../services/api";

function OrganizerDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/events/organizer/dashboard/");
        setStats(response.data);
      } catch (err) {
        console.error("DASHBOARD ERROR:", err.response);
        setError("Failed to load organizer dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Organizer Dashboard</h2>

      {stats.length === 0 && <p>No events found.</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Event</th>
            <th>Total Bookings</th>
            <th>Active</th>
            <th>Cancelled</th>
            <th>Seats Filled</th>
            <th>Total Seats</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item) => (
            <tr key={item.event_id}>
              <td>{item.title}</td>
              <td>{item.total_bookings}</td>
              <td>{item.active_bookings}</td>
              <td>{item.cancelled_bookings}</td>
              <td>{item.seats_filled}</td>
              <td>{item.total_seats}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerDashboard;
