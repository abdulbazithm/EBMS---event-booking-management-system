import { useEffect, useState } from "react";
import { getMe } from "../services/auth";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome to EBMS</h2>

      {/* 🔔 ORGANIZER APPROVAL PENDING MESSAGE */}
      {user?.organizer_requested && !user?.is_organizer && (
        <p style={{ color: "orange", fontWeight: "bold" }}>
          ⏳ Your organizer request is under review by admin.
        </p>
      )}

      {/* Optional message for approved organizer */}
      {user?.is_organizer && (
        <p style={{ color: "green" }}>
          ✅ You are an approved organizer. You can now create and manage events.
        </p>
      )}

      <p>
        Browse events, book tickets, and manage your bookings from the menu.
      </p>
    </div>
  );
}

export default Home;
