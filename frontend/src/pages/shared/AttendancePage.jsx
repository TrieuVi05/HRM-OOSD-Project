import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AttendancePage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .getAttendance(token)
      .then((data) => {
        if (!ignore) setItems(data || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load attendance");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: "#b91c1c" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Attendance</h1>
      <ul style={{ marginTop: 16 }}>
        {items.map((a) => (
          <li key={a.id}>
            {a.employee?.fullName || a.employee?.id} - {a.date} - {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
