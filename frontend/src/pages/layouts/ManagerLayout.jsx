import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../manager/manager.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        "mgr-side-item" + (isActive ? " active" : "")
      }
    >
      <span className="mgr-side-ico">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function ManagerLayout() {
  const { user, logout } = useAuth(); // nếu bạn đang có user/email/name thì lấy ra
  const name = user?.username || user?.fullName || "manager";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // gọi logout trong AuthContext
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mgr-shell">
      {/* Sidebar */}
      <aside className="mgr-side">
        <div className="mgr-side-brand">
          <div className="mgr-side-logo">🏢</div>
          <div>
            <div className="mgr-side-title">Manager</div>
            <div className="mgr-side-sub">HRM</div>
          </div>
        </div>

        <nav className="mgr-side-nav">
          <Item to="/dashboard/manager" icon="📊" label="Dashboard" />
          <Item
            to="/dashboard/manager/leaves"
            icon="📝"
            label="Duyệt nghỉ phép"
          />
          <Item
            to="/dashboard/manager/attendance"
            icon="⏱️"
            label="Chấm công"
          />
          <Item to="/employees" icon="👥" label="Nhân viên" />
        </nav>
      </aside>

      {/* Main */}
      <main className="mgr-main">
        {/* Topbar */}
        <header className="mgr-top">
          <div className="mgr-top-title">Manager Panel</div>
          <div className="mgr-top-right">
            <div className="mgr-user">
              <span className="mgr-user-dot" />
              <span className="mgr-user-name">{name}</span>
            </div>
            <div className="mgr-dropdown">
              <button
                className="mgr-iconbtn"
                title="Settings"
                onClick={() => setOpen(!open)}
              >
                ⚙️
              </button>

              {open && (
                <div className="mgr-menu">
                  <button
                    className="mgr-menu-item danger"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mgr-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
