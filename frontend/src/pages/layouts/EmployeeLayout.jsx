import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

export default function EmployeeLayout() {
  const location = useLocation();
  const menuItems = [
    { path: "/work-schedules", label: "Lịch làm việc", icon: "📅" },
    { path: "/attendance", label: "Chấm Công", icon: "⏱️" },
    { path: "/leaves", label: "Nghỉ Phép", icon: "🏖️" },
    { path: "/payroll", label: "Lương", icon: "💰" }
  ];

  return (
    <div className="app-root">
      <Header />
      <main className="app-content" style={{ display: "flex", gap: 16 }}>
        <aside style={{ width: 220, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, height: "fit-content" }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>HRM System</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Employee Portal</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontSize: 12,
                    color: isActive ? "#2563eb" : "#374151",
                    background: isActive ? "#eff6ff" : "transparent",
                    border: isActive ? "1px solid #dbeafe" : "1px solid transparent"
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
