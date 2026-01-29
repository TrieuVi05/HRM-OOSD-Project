import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUS_MAP = {
  PRESENT: { color: "#22c55e", bg: "#dcfce7", text: "Có mặt" },
  ABSENT: { color: "#dc2626", bg: "#fee2e2", text: "Vắng mặt" },
  LEAVE: { color: "#f59e42", bg: "#fef3c7", text: "Nghỉ phép" },
};

export default function EmployeeAttendancePage() {
  const { token, user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      api.getAttendance(token),
      api.getEmployees(token)
    ])
      .then(([attRes, empRes]) => {
        if (ignore) return;
        setAttendance(attRes.status === "fulfilled" ? attRes.value || [] : []);
        setEmployees(empRes.status === "fulfilled" ? empRes.value || [] : []);
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

  const currentEmployee = useMemo(() => {
    if (!user || employees.length === 0) return null;
    const normalizedUser = String(user).toLowerCase();
    return (
      employees.find((e) => String(e.username || "").toLowerCase() === normalizedUser) ||
      employees.find((e) => String(e.email || "").toLowerCase() === normalizedUser) ||
      employees.find((e) => String(e.fullName || "").toLowerCase() === normalizedUser) ||
      employees.find((e) => String(e.email || "").split("@")[0].toLowerCase() === normalizedUser) ||
      employees.find((e) => String(e.employeeCode || "").toLowerCase() === normalizedUser) ||
      null
    );
  }, [employees, user]);

  const attendanceForEmployee = useMemo(() => {
    if (!currentEmployee) return [];
    return attendance.filter((a) => String(a.employeeId) === String(currentEmployee.id));
  }, [attendance, currentEmployee]);

  // Helper to format time as HH:mm
  function formatTime(val) {
    if (!val) return "-";
    // Accepts: '2026-01-01T08:15:00' or '08:15:00' or '08:15'
    if (val.length === 5) return val;
    if (val.length >= 8 && val[2] === ':' && val[5] === ':') return val.slice(0, 5);
    if (val.includes('T')) {
      const t = val.split('T')[1];
      return t ? t.slice(0, 5) : '-';
    }
    return val;
  }

  // Helper to get status detail
  function getStatusDetail(a) {
    if ((a.status || '').toUpperCase() === 'ABSENT') return 'Vắng mặt';
    if (!a.checkIn) return 'Vắng mặt';
    // Giả sử giờ chuẩn là 08:15 vào, 17:30 ra
    const standardIn = '08:15';
    const standardOut = '17:30';
    const inTime = formatTime(a.checkIn);
    const outTime = formatTime(a.checkOut);
    let detail = '';
    if (inTime > standardIn) detail += 'Đi trễ';
    if (outTime && outTime < standardOut) detail += (detail ? ', ' : '') + 'Về sớm';
    if (!detail) detail = 'Đúng giờ';
    return detail;
  }

  const totalDays = attendanceForEmployee.length;
  const presentDays = attendanceForEmployee.filter((a) => (a.status || "").toUpperCase() === "PRESENT").length;
  const absentDays = attendanceForEmployee.filter((a) => (a.status || "").toUpperCase() === "ABSENT").length;

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Chấm Công</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Lịch sử chấm công của bạn</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#2563eb" }}>📅</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng ngày</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{totalDays}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#22c55e" }}>✅</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Có mặt</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{presentDays}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#dc2626" }}>❌</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Vắng mặt</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>{absentDays}</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Ngày Làm Việc</th>
                <th style={{ padding: 8, textAlign: "left" }}>Giờ Vào</th>
                <th style={{ padding: 8, textAlign: "left" }}>Giờ Ra</th>
                <th style={{ padding: 8, textAlign: "center" }}>Trạng Thái</th>
                <th style={{ padding: 8, textAlign: "left" }}>Ghi Chú</th>
              </tr>
            </thead>
            <tbody>
              {attendanceForEmployee.length === 0 ? (
                <tr><td colSpan={5} style={{ color: "#9ca3af", textAlign: "center", padding: 16 }}>Không có dữ liệu chấm công.</td></tr>
              ) : (
                attendanceForEmployee.map((a) => {
                  const status = (a.status || "PRESENT").toUpperCase();
                  const statusStyle = STATUS_MAP[status] || STATUS_MAP.PRESENT;
                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: 8 }}>{a.workDate || "-"}</td>
                      <td style={{ padding: 8 }}>{formatTime(a.checkIn)}</td>
                      <td style={{ padding: 8 }}>{formatTime(a.checkOut)}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: 8, padding: "2px 10px", fontSize: 12 }}>{statusStyle.text}</span>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{getStatusDetail(a)}</div>
                      </td>
                      <td style={{ padding: 8 }}>{a.note || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
