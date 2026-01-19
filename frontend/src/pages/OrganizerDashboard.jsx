import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/organizerDashboard.css";

function OrganizerDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    api
      .get("/events/organizer/dashboard/")
      .then((res) => setStats(res.data || []))
      .catch(() => setError("Failed to load organizer dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // KPIs
  const totalEvents = stats.length;
  const totalBookings = stats.reduce((s, e) => s + e.total_bookings, 0);
  const activeBookings = stats.reduce((s, e) => s + e.active_bookings, 0);
  const cancelledBookings = stats.reduce((s, e) => s + e.cancelled_bookings, 0);
  const seatsFilled = stats.reduce((s, e) => s + e.seats_filled, 0);

  // Filters
  const filteredStats = stats.filter((item) => {
    if (statusFilter === "ACTIVE" && item.active_bookings === 0) return false;
    if (statusFilter === "CANCELLED" && item.cancelled_bookings === 0) return false;

    const eventDate = new Date(item.event_date);
    if (fromDate && eventDate < new Date(fromDate)) return false;
    if (toDate && eventDate > new Date(toDate)) return false;

    return true;
  });

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Organizer Dashboard</h2>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <KpiCard title="Total Events" value={totalEvents} />
        <KpiCard title="Total Bookings" value={totalBookings} />
        <KpiCard title="Active Bookings" value={activeBookings} />
        <KpiCard title="Cancelled Bookings" value={cancelledBookings} />
        <KpiCard title="Seats Filled" value={seatsFilled} />
      </div>

      {/* FILTERS */}
      <div className="filter-bar">
        <label>
          Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>

        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>

        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>

        <button
          className="btn-clear"
          onClick={() => {
            setStatusFilter("ALL");
            setFromDate("");
            setToDate("");
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* TABLE */}
      {filteredStats.length === 0 ? (
        <p>No events match the selected filters.</p>
      ) : (
        <table className="dashboard-table">
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

/* KPI CARD */
function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <div className="kpi-value">{value}</div>
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ active, cancelled }) {
  if (active > 0 && cancelled > 0) {
    return (
      <>
        <span className="badge badge-active">Active</span>
        <span className="badge badge-cancelled">Cancelled</span>
      </>
    );
  }
  if (active > 0) return <span className="badge badge-active">Active</span>;
  if (cancelled > 0)
    return <span className="badge badge-cancelled">Cancelled</span>;
  return <span className="badge badge-neutral">No Bookings</span>;
}

export default OrganizerDashboard;
