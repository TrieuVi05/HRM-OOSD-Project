import { Outlet, Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../../components/common/Modal.jsx";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, role } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuItems = [
    { path: "/employees", label: "Nhân viên", icon: "👥" },
    { path: "/attendance", label: "Chấm công", icon: "⏰" },
    { path: "/leaves", label: "Nghỉ phép", icon: "🏖️" },
    { path: "/recruitment", label: "Tuyển dụng", icon: "📝" },
    { path: "/payroll", label: "Lương", icon: "💰" },
    { path: "/roles", label: "Users & Roles", icon: "🧩" },
    { path: "/contracts", label: "Hợp đồng", icon: "🧾" },
  ];


  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F9F8F3' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#FAF9F6', boxShadow: '2px 0 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #e7e5df' }}>
          <Link to="/dashboard/admin" style={{ textDecoration: "none" }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#4F46E5', margin: 0 }}>🏢 HR Admin</h1>
          </Link>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7280" }}>HRM</p>
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
                  color: isActive ? '#4F46E5' : '#6b7280',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#EEF2FF' : 'transparent',
                  borderLeft: isActive ? '3px solid #4F46E5' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: '#fff', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Admin Panel</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>👤 {user || "HR Admin"}</span>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setSettingsOpen((prev) => !prev)}
                  style={{ padding: '6px 10px', background: '#F9F8F3', color: '#111827', border: '1px solid #e7e5df', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}
                >
                  ⚙️
                </button>
                {settingsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 40,
                      minWidth: 160,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                      overflow: "hidden",
                      zIndex: 20
                    }}
                  >
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        setProfileOpen(true);
                      }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer" }}
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={() => {
                        setSettingsOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", color: "#dc2626" }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>
        
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="Hồ sơ" maxWidth={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Username</label>
            <input
              type="text"
              value={user || ""}
              readOnly
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12, background: "#f9fafb" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Role</label>
            <input
              type="text"
              value={role || ""}
              readOnly
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12, background: "#f9fafb" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setProfileOpen(false)}
              style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
