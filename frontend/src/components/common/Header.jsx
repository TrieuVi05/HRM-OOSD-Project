import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { role } = useAuth();

  return (
    <header style={{ padding: "12px 24px", background: "#ffffff", borderBottom: "1px solid #e5e7eb" }}>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/">HRM</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/leaves">Leaves</Link>
        <Link to="/payroll">Payroll</Link>
        <Link to="/recruitment">Recruitment</Link>
        {role === "HR_ADMIN" && <Link to="/dashboard/admin">Admin</Link>}
        {role === "MANAGER" && <Link to="/dashboard/manager">Manager</Link>}
        {role === "EMPLOYEE" && <Link to="/dashboard/employee">Employee</Link>}
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
