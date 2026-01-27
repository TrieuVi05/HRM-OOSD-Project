import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-CA", { hour: "2-digit", minute: "2-digit" });
}

export default function UsersRolesPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([api.getUsers(token), api.getRoles(token)])
      .then(([usersData, rolesData]) => {
        if (ignore) return;
        setUsers(usersData || []);
        setRoles(rolesData || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu người dùng");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const keyword = searchTerm.toLowerCase();
    return users.filter((user) =>
      [user.username, user.email, user.fullName].some((value) =>
        String(value || "").toLowerCase().includes(keyword)
      )
    );
  }, [users, searchTerm]);

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>User & Role Management</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>Manage user accounts, roles, and system settings</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Users</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{users.length}</div>
          <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>Active</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Roles</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{roles.length}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Custom role definitions</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>System Settings</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>8</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Configuration options</div>
        </div>
      </div>

      <div style={{ display: "inline-flex", gap: 8, background: "#f3f4f6", borderRadius: 999, padding: 4, marginTop: 16 }}>
        {[
          { key: "users", label: "Users" },
          { key: "roles", label: "Roles & Permissions" },
          { key: "settings", label: "System Settings" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              border: "none",
              background: activeTab === tab.key ? "#fff" : "transparent",
              padding: "6px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: activeTab === tab.key ? 600 : 500,
              cursor: "pointer",
              boxShadow: activeTab === tab.key ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "users" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>User Accounts</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 999, padding: "6px 12px", fontSize: 12, minWidth: 180 }}
              />
              <button style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 10, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>+ Add User</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                  <th style={{ padding: "8px 6px" }}>Username</th>
                  <th style={{ padding: "8px 6px" }}>Email</th>
                  <th style={{ padding: "8px 6px" }}>Role</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                  <th style={{ padding: "8px 6px" }}>Created At</th>
                  <th style={{ padding: "8px 6px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "#9ca3af" }}>No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 6px", fontWeight: 600 }}>{user.username}</td>
                      <td style={{ padding: "8px 6px" }}>{user.email}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: "#f3f4f6", fontSize: 11 }}>N/A</span>
                      </td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: user.status === "ACTIVE" ? "#dcfce7" : "#f3f4f6", color: user.status === "ACTIVE" ? "#166534" : "#6b7280", fontSize: 11 }}>
                          {(user.status || "inactive").toLowerCase()}
                        </span>
                      </td>
                      <td style={{ padding: "8px 6px" }}>{formatDateTime(user.createdAt)}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>✏️</button>
                          <button style={{ border: "1px solid #ef4444", background: "#fff", color: "#ef4444", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "roles" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Roles & Permissions</h3>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {roles.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 12 }}>No roles found.</div>
            ) : (
              roles.map((role) => (
                <div key={role.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{role.name}</div>
                  <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>{role.description || "No description"}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>System Settings</h3>
          <p style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>This section is ready for future configuration.</p>
        </div>
      )}
    </div>
  );
}
