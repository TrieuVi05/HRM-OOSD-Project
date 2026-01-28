import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { role } = useAuth();

  return (
    <header style={{ padding: "12px 24px", background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
      <nav style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/dashboard/employee" style={{ fontWeight: 700, color: "#1d4ed8", textDecoration: "none" }}>HRM</Link>
        {role ? (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Link to="/employees">Nhân viên</Link>
            <Link to="/departments">Phòng ban</Link>
            <Link to="/attendance">Chấm công</Link>
            <Link to="/leaves">Nghỉ phép</Link>
            <Link to="/payroll">Lương</Link>
            <Link to="/recruitment">Tuyển dụng</Link>
            {role === "HR_ADMIN" && <Link to="/dashboard/admin">Dashboard</Link>}
            {role === "MANAGER" && <Link to="/dashboard/manager">Dashboard</Link>}
            {role === "EMPLOYEE" && <Link to="/dashboard/employee">Dashboard</Link>}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/careers">Tuyển dụng</Link>
            <Link to="/login" style={{ padding: "6px 12px", borderRadius: 8, background: "#1d4ed8", color: "#fff", textDecoration: "none" }}>
              Đăng nhập hệ thống
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
