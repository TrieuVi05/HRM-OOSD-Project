import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoginForm from "../../components/auth/LoginForm.jsx";

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
      const msg = (err && err.message) ? err.message : "";
      if (msg.toLowerCase().includes("bad credentials")) {
        setError("Sai tên đăng nhập hoặc mật khẩu");
      } else {
        setError(msg || "Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      username={username}
      password={password}
      onChangeUsername={setUsername}
      onChangePassword={setPassword}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
    />
  );
}
