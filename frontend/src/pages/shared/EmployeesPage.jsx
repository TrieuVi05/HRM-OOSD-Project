import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function EmployeesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .getEmployees(token)
      .then((data) => {
        if (!ignore) setItems(data || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load employees");
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
      <h1>Employees</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>ID</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>Full Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>Email</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", paddingBottom: 8 }}>Department</th>
          </tr>
        </thead>
        <tbody>
          {items.map((emp) => (
            <tr key={emp.id}>
              <td style={{ padding: "8px 0" }}>{emp.id}</td>
              <td>{emp.fullName || `${emp.firstName || ""} ${emp.lastName || ""}`.trim()}</td>
              <td>{emp.email || "-"}</td>
              <td>{emp.department?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
