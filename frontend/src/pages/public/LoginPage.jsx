import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ username, password });
      login({ token: data.token, role: data.role, user: data.username });
      const roleToPath = {
  HR_ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  EMPLOYEE: "/dashboard/employee",
};

navigate(roleToPath[data.role] || "/dashboard/employee");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 24, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff" }}>
      <h1 style={{ marginBottom: 16 }}>Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div style={{ color: "#b91c1c" }}>{error}</div>}
        <button disabled={loading} style={{ padding: "10px 12px" }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
