import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import "./manager.css";
function formatLocalDate(date) {
  return date.toLocaleDateString("en-CA"); // yyyy-mm-dd
}

function normalizeLeaveStatus(status) {
  const v = (status || "").toLowerCase();
  if (v.includes("approved") || v.includes("duyet")) return "approved";
  if (v.includes("rejected") || v.includes("tu choi")) return "rejected";
  return "pending";
}

function normalizeAttendanceStatus(status) {
  const v = (status || "").toLowerCase();
  if (v.includes("late") || v.includes("muon")) return "late";
  if (v.includes("absent") || v.includes("vang")) return "absent";
  return "present";
}

function Pill({ children, tone = "gray" }) {
  const t = {
    gray: { bg: "#f3f4f6", bd: "#e5e7eb", fg: "#374151" },
    blue: { bg: "#eff6ff", bd: "#bfdbfe", fg: "#1d4ed8" },
    yellow: { bg: "#fffbeb", bd: "#fde68a", fg: "#92400e" },
    red: { bg: "#fef2f2", bd: "#fecaca", fg: "#b91c1c" },
    green: { bg: "#ecfdf5", bd: "#a7f3d0", fg: "#047857" },
  }[tone] || { bg: "#f3f4f6", bd: "#e5e7eb", fg: "#374151" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        border: `1px solid ${t.bd}`,
        background: t.bg,
        color: t.fg,
        fontSize: 11,
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

function Card({ title, value, subtitle, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 700 }}>
            {title}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 28,
              fontWeight: 950,
              color: "#111827",
            }}
          >
            {value}
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, right, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h3
          style={{ margin: 0, fontSize: 14, fontWeight: 950, color: "#111827" }}
        >
          {title}
        </h3>
        {right}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Btn({ children, variant = "secondary", onClick, disabled }) {
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: isPrimary ? "1px solid #111827" : "1px solid #e5e7eb",
        background: isPrimary ? "#111827" : "#fff",
        color: isPrimary ? "#fff" : "#111827",
        padding: "9px 12px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 900,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        boxShadow: isPrimary ? "0 10px 20px rgba(17,24,39,0.14)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export default function ManagerDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [actionLoading, setActionLoading] = useState({}); // { [leaveId]: true }
  const [refreshing, setRefreshing] = useState(false);

  const todayKey = formatLocalDate(new Date());

  const fetchAll = async (opts = { silent: false }) => {
    const silent = !!opts?.silent;
    if (!silent) {
      setLoading(true);
      setError("");
    } else {
      setRefreshing(true);
      setError("");
    }

    try {
      const [empData, attData, leaveData] = await Promise.all([
        api.getEmployees(token),
        api.getAttendance(token),
        api.getLeaves(token),
      ]);

      setEmployees(empData || []);
      setAttendance(attData || []);
      setLeaves(leaveData || []);
    } catch (e) {
      setError(e?.message || "Không thể tải dữ liệu dashboard");
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll({ silent: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const pendingLeaves = useMemo(
    () => leaves.filter((x) => normalizeLeaveStatus(x.status) === "pending"),
    [leaves],
  );

  const issuesToday = useMemo(() => {
    const today = attendance.filter((x) => x?.workDate === todayKey);
    return today.filter((x) => {
      const st = normalizeAttendanceStatus(x.status);
      return st === "late" || st === "absent";
    });
  }, [attendance, todayKey]);

  const setRowLoading = (leaveId, value) => {
    setActionLoading((prev) => ({ ...prev, [leaveId]: value }));
  };

  const updateLeaveInState = (leaveId, updated) => {
    setLeaves((prev) =>
      prev.map((x) =>
        x.id === leaveId ? (updated ? { ...x, ...updated } : { ...x }) : x,
      ),
    );
  };

  const onApprove = async (leave) => {
    if (!leave?.id) return;
    setRowLoading(leave.id, true);
    setError("");
    try {
      const updated = await api.approveLeave(token, leave.id, {
        approvedBy: null,
      });
      updateLeaveInState(leave.id, updated);
    } catch (e) {
      setError(e?.message || "Approve failed");
    } finally {
      setRowLoading(leave.id, false);
    }
  };

  const onReject = async (leave) => {
    if (!leave?.id) return;
    setRowLoading(leave.id, true);
    setError("");
    try {
      const updated = await api.rejectLeave(token, leave.id, {
        approvedBy: null,
      });
      updateLeaveInState(leave.id, updated);
    } catch (e) {
      setError(e?.message || "Reject failed");
    } finally {
      setRowLoading(leave.id, false);
    }
  };
  return (
    <div className="mgr-page">
      <div className="mgr-header">
        <div>
          <div className="mgr-kicker">ADMIN PORTAL</div>
          <h1 className="mgr-title">Manager Dashboard</h1>
          <div className="mgr-sub">
            <span className="mgr-badge blue">Today: {todayKey}</span>
            <span>Overview & approvals</span>
            <button
              className="mgr-btn"
              disabled={refreshing}
              onClick={() => fetchAll({ silent: true })}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 10 }} className="mgr-badge red">
              {error}
            </div>
          )}
        </div>

        <div className="mgr-actions">
          <button className="mgr-btn" onClick={() => navigate("/employees")}>
            Employees
          </button>
          <button className="mgr-btn" onClick={() => navigate("/attendance")}>
            Attendance
          </button>
          <button
            className="mgr-btn primary"
            onClick={() => navigate("/dashboard/manager/leaves")}
          >
            Review Leaves
          </button>
        </div>
      </div>

      <div className="mgr-grid-3">
        <div className="mgr-card mgr-stat">
          <div>
            <div className="label">Total Employees</div>
            <div className="value">{employees.length}</div>
            <div className="hint">Active staff members</div>
          </div>
          <div className="mgr-iconbox">👥</div>
        </div>

        <div className="mgr-card mgr-stat">
          <div>
            <div className="label">Pending Approvals</div>
            <div className="value">{pendingLeaves.length}</div>
            <div className="hint">Leaves waiting for review</div>
          </div>
          <div className="mgr-iconbox">📝</div>
        </div>

        <div className="mgr-card mgr-stat">
          <div>
            <div className="label">Attendance Issues</div>
            <div className="value">{issuesToday.length}</div>
            <div className="hint">Late or Absent today</div>
          </div>
          <div className="mgr-iconbox">⚠️</div>
        </div>
      </div>

      <div className="mgr-grid-2">
        <div className="mgr-card">
          <div className="mgr-panel-head">
            <h3 className="mgr-panel-title">Pending Leave Requests</h3>
            <span
              className={`mgr-badge ${pendingLeaves.length ? "amber" : ""}`}
            >
              {pendingLeaves.length} Waiting
            </span>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="mgr-empty">
              <h4>All caught up!</h4>
              <p>No pending leave requests at the moment.</p>
              <div style={{ marginTop: 12 }}>
                <button
                  className="mgr-btn primary"
                  onClick={() => navigate("/dashboard/manager/leaves")}
                >
                  Go to Leaves
                </button>
              </div>
            </div>
          ) : (
            <div className="mgr-list">
              {pendingLeaves.slice(0, 6).map((x) => {
                const busy = !!actionLoading[x.id];
                const initials = `E${x.employeeId ?? x.employee_id}`;

                return (
                  <div className="mgr-item" key={x.id}>
                    <div className="mgr-left">
                      <div className="mgr-avatar">{initials}</div>
                      <div className="mgr-meta">
                        <div className="name">
                          Leave #{x.id} • Employee #
                          {x.employeeId ?? x.employee_id}
                        </div>
                        <div className="desc">
                          {x.startDate ?? x.start_date} →{" "}
                          {x.endDate ?? x.end_date}
                        </div>
                      </div>
                    </div>

                    <div className="mgr-right">
                      <span className="mgr-badge amber">PENDING</span>
                      <button
                        className="mgr-btn success"
                        disabled={busy}
                        onClick={() => onApprove(x)}
                      >
                        {busy ? "..." : "Approve"}
                      </button>
                      <button
                        className="mgr-btn danger"
                        disabled={busy}
                        onClick={() => onReject(x)}
                      >
                        {busy ? "..." : "Reject"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mgr-card">
          <div className="mgr-panel-head">
            <h3 className="mgr-panel-title">Attendance Alert (Today)</h3>
            <span
              className={`mgr-badge ${issuesToday.length ? "red" : "green"}`}
            >
              {issuesToday.length} Issues
            </span>
          </div>

          {issuesToday.length === 0 ? (
            <div className="mgr-empty">
              <h4>All good</h4>
              <p>No late/absent records today.</p>
              <div style={{ marginTop: 12 }}>
                <button
                  className="mgr-btn"
                  onClick={() => navigate("/attendance")}
                >
                  View attendance
                </button>
              </div>
            </div>
          ) : (
            <div className="mgr-list">
              {issuesToday.slice(0, 6).map((x) => {
                const st = normalizeAttendanceStatus(x.status);
                const badgeTone = st === "absent" ? "red" : "amber";
                const initials = `E${x.employeeId ?? x.employee_id}`;

                return (
                  <div className="mgr-item" key={x.id}>
                    <div className="mgr-left">
                      <div className="mgr-avatar">{initials}</div>
                      <div className="mgr-meta">
                        <div className="name">
                          Employee #{x.employeeId ?? x.employee_id}
                        </div>
                        <div className="desc">Recorded as: {st}</div>
                      </div>
                    </div>

                    <div className="mgr-right">
                      <span className={`mgr-badge ${badgeTone}`}>
                        {st.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
