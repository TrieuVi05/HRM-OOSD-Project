import { Outlet, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const menuItems = [
  { path: "/dashboard/admin", label: "Dashboard", icon: "📊" },
  { path: "/employees", label: "Nhân viên", icon: "👥" },
  { path: "/departments", label: "Phòng ban", icon: "🏢" },
  { path: "/attendance", label: "Chấm công", icon: "⏰" },
  { path: "/leaves", label: "Nghỉ phép", icon: "🏖️" },
  { path: "/recruitment", label: "Tuyển dụng", icon: "📝" },
  { path: "/payroll", label: "Lương", icon: "💰" },
];


  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#fff', boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6', margin: 0 }}>🏢 HRM System</h1>
        </div>
        
        <nav style={{ marginTop: 8 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: isActive ? '#3b82f6' : '#6b7280',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#eff6ff' : 'transparent',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 14, color: '#6b7280' }}>👤 {user || "Admin"}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: '#fff', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Admin Panel</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>👤 Admin User</span>
              <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  style={{ padding: '6px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}
                >
                  Đăng xuất
              </button>

            </div>
          </div>
        </header>
        
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
