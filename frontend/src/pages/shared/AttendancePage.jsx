import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatLocalDate(date) {
  return date.toLocaleDateString("en-CA");
}

function normalizeStatus(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("late") || value.includes("muon")) return "late";
  if (value.includes("absent") || value.includes("vang")) return "absent";
  return "present";
}

function formatTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0h";
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "0h";
  const diff = Math.max(0, end - start);
  const hours = Math.round((diff / 36e5) * 10) / 10;
  return `${hours}h`;
}

export default function AttendancePage() {
  const { token } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([
      api.getAttendance(token),
      api.getLeaves(token),
      api.getEmployees(token)
    ])
      .then(([attendanceData, leavesData, employeesData]) => {
        if (ignore) return;
        setAttendance(attendanceData || []);
        setLeaves(leavesData || []);
        setEmployees(employeesData || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu chấm công");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => map.set(emp.id, emp));
    return map;
  }, [employees]);

  const attendanceByDate = useMemo(
    () => attendance.filter((item) => item?.workDate === selectedDate),
    [attendance, selectedDate]
  );

  const presentCount = attendanceByDate.filter((item) => normalizeStatus(item.status) === "present").length;
  const absentCount = attendanceByDate.filter((item) => normalizeStatus(item.status) === "absent").length;
  const lateCount = attendanceByDate.filter((item) => normalizeStatus(item.status) === "late").length;
  const totalEmployees = employees.length || attendanceByDate.length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  const pendingLeaves = leaves.filter((leave) => {
    const status = (leave?.status || "").toLowerCase();
    return status === "pending" || status.includes("pending") || status.includes("chờ");
  });

  const issuesToday = attendanceByDate.filter((item) => {
    const status = normalizeStatus(item.status);
    return status === "absent" || status === "late";
  });

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Attendance & Leave Management</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>View attendance records and manage leave requests</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Today's Attendance</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{presentCount} / {totalEmployees}</div>
          <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>{attendanceRate}% present</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Pending Leave Requests</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{pendingLeaves.length}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Requires action</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Attendance Issues</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{issuesToday.length}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Pending review</div>
        </div>
      </div>

      <div style={{ display: "inline-flex", gap: 8, background: "#f3f4f6", borderRadius: 999, padding: 4, marginTop: 16 }}>
        {[
          { key: "attendance", label: "Attendance Records" },
          { key: "leaves", label: "Leave Requests" },
          { key: "issues", label: "Issues" }
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

      {activeTab === "attendance" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Daily Attendance</h3>
            <label style={{ fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 8 }}>
              Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "4px 8px", fontSize: 12 }}
              />
            </label>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                  <th style={{ padding: "8px 6px" }}>Employee Name</th>
                  <th style={{ padding: "8px 6px" }}>Date</th>
                  <th style={{ padding: "8px 6px" }}>Check In</th>
                  <th style={{ padding: "8px 6px" }}>Check Out</th>
                  <th style={{ padding: "8px 6px" }}>Hours</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceByDate.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "#9ca3af" }}>No attendance records for this date.</td>
                  </tr>
                ) : (
                  attendanceByDate.map((item) => {
                    const emp = employeeMap.get(item.employeeId) || item.employee;
                    const status = normalizeStatus(item.status);
                    const statusColor = status === "absent" ? "#ef4444" : status === "late" ? "#f59e0b" : "#111827";
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "8px 6px", fontWeight: 600 }}>{emp?.fullName || `Employee #${item.employeeId}`}</td>
                        <td style={{ padding: "8px 6px" }}>{item.workDate}</td>
                        <td style={{ padding: "8px 6px" }}>{formatTime(item.checkIn)}</td>
                        <td style={{ padding: "8px 6px" }}>{formatTime(item.checkOut)}</td>
                        <td style={{ padding: "8px 6px" }}>{calcHours(item.checkIn, item.checkOut)}</td>
                        <td style={{ padding: "8px 6px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 999, background: "#f3f4f6", color: statusColor, fontWeight: 600, fontSize: 11 }}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "leaves" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Leave Requests</h3>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {leaves.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 12 }}>No leave requests.</div>
            ) : (
              leaves.map((leave) => {
                const emp = employeeMap.get(leave.employeeId) || leave.employee;
                return (
                  <div key={leave.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{emp?.fullName || `Employee #${leave.employeeId}`}</div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>{leave.startDate} → {leave.endDate}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Status: {(leave.status || "").toLowerCase()}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Attendance Issues</h3>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {issuesToday.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 12 }}>No issues for this date.</div>
            ) : (
              issuesToday.map((item) => {
                const emp = employeeMap.get(item.employeeId) || item.employee;
                const status = normalizeStatus(item.status);
                return (
                  <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>{emp?.fullName || `Employee #${item.employeeId}`}</div>
                    <div style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}>{item.workDate}</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>Status: {status}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
