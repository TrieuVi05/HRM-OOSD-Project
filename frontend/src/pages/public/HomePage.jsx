import { useAuth } from "../../context/AuthContext.jsx";

export default function HomePage() {
  const { user, role } = useAuth();
  return (
    <div style={{ padding: 32 }}>
      <h1>HRM Dashboard</h1>
      <p>Welcome {user || "guest"}.</p>
      <p>Your role: {role || "N/A"}</p>
    </div>
  );
}
