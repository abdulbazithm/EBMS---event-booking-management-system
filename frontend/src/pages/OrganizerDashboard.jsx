import { useEffect, useState } from "react";
import api from "../services/api";

function OrganizerDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/events/organizer/dashboard/");
      setStats(response.data || []);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err.response);
      setError("Failed to load organizer dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 🔢 KPIs
  const totalEvents = stats.length;
  const totalBookings = stats.reduce((s, e) => s + e.total_bookings, 0);
  const activeBookings = stats.reduce((s, e) => s + e.active_bookings, 0);
  const cancelledBookings = stats.reduce((s, e) => s + e.cancelled_bookings, 0);
  const seatsFilled = stats.reduce((s, e) => s + e.seats_filled, 0);

  // 🔍 FILTER PIPELINE
  const filteredStats = stats.filter((item) => {
    // Status filter
    if (statusFilter === "ACTIVE" && item.active_bookings === 0) return false;
    if (statusFilter === "CANCELLED" && item.cancelled_bookings === 0) return false;

    // Date filter
    const eventDate = new Date(item.event_date);

    if (fromDate && eventDate < new Date(fromDate)) return false;
    if (toDate && eventDate > new Date(toDate)) return false;

    return true;
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "30px auto" }}>
      <h2>Organizer Dashboard</h2>

      {/* 🔢 KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <KpiCard title="Total Events" value={totalEvents} />
        <KpiCard title="Total Bookings" value={totalBookings} />
        <KpiCard title="Active Bookings" value={activeBookings} />
        <KpiCard title="Cancelled Bookings" value={cancelledBookings} />
        <KpiCard title="Seats Filled" value={seatsFilled} />
      </div>

      {/* 🔍 FILTER CONTROLS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Status Filter */}
        <label>
          <strong>Status:</strong>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ marginLeft: "8px" }}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>

        {/* From Date */}
        <label>
          <strong>From:</strong>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ marginLeft: "8px" }}
          />
        </label>

        {/* To Date */}
        <label>
          <strong>To:</strong>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ marginLeft: "8px" }}
          />
        </label>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setStatusFilter("ALL");
            setFromDate("");
            setToDate("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* 📋 TABLE */}
      {filteredStats.length === 0 ? (
        <p>No events match the selected filters.</p>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Total</th>
              <th>Active</th>
              <th>Cancelled</th>
              <th>Status</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats.map((item) => (
              <tr key={item.event_id}>
                <td>{item.title}</td>
                <td>{item.event_date}</td>
                <td>{item.total_bookings}</td>
                <td>{item.active_bookings}</td>
                <td>{item.cancelled_bookings}</td>
                <td>
                  <StatusBadge
                    active={item.active_bookings}
                    cancelled={item.cancelled_bookings}
                  />
                </td>
                <td>
                  {item.seats_filled} / {item.total_seats}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* 🔹 KPI CARD */
function KpiCard({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "6px",
        textAlign: "center",
      }}
    >
      <h4>{title}</h4>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

/* 🟢🔴 STATUS BADGE */
function StatusBadge({ active, cancelled }) {
  if (active > 0 && cancelled > 0) {
    return (
      <>
        <Badge text="Active" color="#2e7d32" />
        <Badge text="Cancelled" color="#c62828" />
      </>
    );
  }

  if (active > 0) return <Badge text="Active" color="#2e7d32" />;
  if (cancelled > 0) return <Badge text="Cancelled" color="#c62828" />;
  return <Badge text="No Bookings" color="#777" />;
}

function Badge({ text, color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        marginRight: "5px",
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
}

export default OrganizerDashboard;
