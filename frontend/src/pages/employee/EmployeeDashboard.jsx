import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatCurrency(value) {
  const formatted = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value || 0);
  return `${formatted}k ₫`;
}

export default function EmployeeDashboard() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      api.getEmployees(token),
      api.getAttendance(token),
      api.getLeaves(token),
      api.getPayrolls(token),
      api.getContracts(token)
    ])
      .then((results) => {
        if (ignore) return;
        const [employeesRes, attendanceRes, leavesRes, payrollsRes, contractsRes] = results;
        setEmployees(employeesRes.status === "fulfilled" ? employeesRes.value || [] : []);
        setAttendance(attendanceRes.status === "fulfilled" ? attendanceRes.value || [] : []);
        setLeaves(leavesRes.status === "fulfilled" ? leavesRes.value || [] : []);
        setPayrolls(payrollsRes.status === "fulfilled" ? payrollsRes.value || [] : []);
        setContracts(contractsRes.status === "fulfilled" ? contractsRes.value || [] : []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu dashboard");
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

  const todayKey = new Date().toLocaleDateString("en-CA");

  const attendanceForEmployee = useMemo(() => {
    if (!currentEmployee) return [];
    return attendance.filter((a) => String(a.employeeId) === String(currentEmployee.id));
  }, [attendance, currentEmployee]);

  const attendanceToday = attendanceForEmployee.filter((a) => a?.workDate === todayKey);
  const presentToday = attendanceToday.filter((a) => {
    const v = (a?.status || "").toLowerCase();
    return v.includes("late") || v.includes("muon") || v.includes("present") || v.includes("dilam") || v.includes("on_time");
  }).length;

  const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
  const daysThisMonth = attendanceForEmployee.filter((a) => {
    if (!a?.workDate) return false;
    return String(a.workDate).slice(0, 7) === monthKey;
  }).length;

  const pendingLeaves = (leaves || []).filter((l) => String(l.employeeId) === String(currentEmployee?.id) && ((l?.status || "").toLowerCase().includes("pending") || l?.status === "PENDING"));

  const approvedLeavesThisMonth = (leaves || []).filter((l) => {
    if (String(l.employeeId) !== String(currentEmployee?.id)) return false;
    const status = (l?.status || "").toLowerCase();
    if (!status.includes("approved") && l?.status !== "APPROVED") return false;
    if (!l?.startDate) return false;
    const d = new Date(l.startDate);
    return d.getFullYear() === new Date().getFullYear() && d.getMonth() === new Date().getMonth();
  });

  const daysOffThisMonth = approvedLeavesThisMonth.reduce((acc, l) => {
    if (!l?.startDate || !l?.endDate) return acc + 1;
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return acc + 1;
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return acc + Math.max(diff, 1);
  }, 0);

  const latestPayroll = useMemo(() => {
    if (!currentEmployee || payrolls.length === 0) return null;
    const items = payrolls.filter((p) => String(p.employeeId) === String(currentEmployee.id));
    if (items.length === 0) return null;
    items.sort((a, b) => new Date(b.generatedAt || b.periodStart || 0) - new Date(a.generatedAt || a.periodStart || 0));
    return items[0];
  }, [payrolls, currentEmployee]);

  const latestContract = useMemo(() => {
    if (!currentEmployee || contracts.length === 0) return null;
    const items = contracts.filter((c) => String(c.employeeId) === String(currentEmployee.id));
    if (items.length === 0) return null;
    items.sort((a, b) => new Date(b.signedAt || b.startDate || 0) - new Date(a.signedAt || a.startDate || 0));
    return items[0];
  }, [contracts, currentEmployee]);

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>Chào mừng, {currentEmployee?.fullName || user || "Nhân viên"}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Dashboard</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{currentEmployee?.position || ""}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
        {[
          { label: "Phòng Ban", value: currentEmployee?.department || "-", icon: "🏢" },
          { label: "Chức Vụ", value: currentEmployee?.position || "-", icon: "🧩" },
          { label: "Loại Hợp Đồng", value: latestContract?.contractType || "Toàn thời gian", icon: "📄" },
          { label: "Trạng Thái", value: (currentEmployee?.status || "").toUpperCase() || "ACTIVE", icon: "✅" }
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{card.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#2563eb", color: "#fff", borderRadius: 10, padding: 14, position: "relative" }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Ngày làm việc tháng này</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{daysThisMonth}</div>
        </div>
        <div style={{ background: "#ef4444", color: "#fff", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Ngày nghỉ tháng này</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{daysOffThisMonth}</div>
        </div>
        <div style={{ background: "#f59e0b", color: "#fff", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Đơn nghỉ chờ duyệt</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{pendingLeaves.length}</div>
        </div>
        <div style={{ background: "#22c55e", color: "#fff", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Lương tháng gần nhất</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{latestPayroll ? formatCurrency(latestPayroll.netSalary ?? (Number(latestPayroll.basicSalary || 0) + Number(latestPayroll.allowance || 0) + Number(latestPayroll.bonus || 0) - Number(latestPayroll.deduction || 0))) : "-"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Chấm Công Gần Đây</h3>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {attendanceForEmployee.slice(0, 5).length === 0 ? (
              <div style={{ color: "#9ca3af", padding: 8 }}>Không có bản ghi chấm công.</div>
            ) : (
              attendanceForEmployee.slice(0, 5).map((a) => {
                const statusText = (a.status || "").toLowerCase();
                const isPresent = statusText.includes("present") || statusText.includes("late") || statusText.includes("muon") || statusText.includes("dilam") || statusText.includes("on_time");
                return (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderRadius: 10, background: "#f9fafb" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{a.workDate || "-"}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>
                        {a.checkIn ? new Date(a.checkIn).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--"}
                        {" - "}
                        {a.checkOut ? new Date(a.checkOut).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "--"}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: isPresent ? "#dcfce7" : "#fee2e2", color: isPresent ? "#16a34a" : "#dc2626" }}>
                      {isPresent ? "Có mặt" : "Vắng mặt"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Đơn Nghỉ Phép Gần Đây</h3>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {leaves.filter((l) => String(l.employeeId) === String(currentEmployee?.id)).slice(0, 5).length === 0 ? (
              <div style={{ color: "#9ca3af", padding: 8 }}>Không có đơn nghỉ phép.</div>
            ) : (
              leaves.filter((l) => String(l.employeeId) === String(currentEmployee?.id)).slice(0, 5).map((l) => {
                const status = (l.status || "").toLowerCase();
                const statusStyle = status.includes("approved") ? { bg: "#dcfce7", color: "#16a34a", text: "Đã duyệt" } : status.includes("rejected") ? { bg: "#fee2e2", color: "#dc2626", text: "Từ chối" } : { bg: "#fef3c7", color: "#d97706", text: "Chờ duyệt" };
                return (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderRadius: 10, background: "#f9fafb" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{l.leaveType || "Nghỉ phép"}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{l.startDate || "-"} - {l.endDate || l.startDate || "-"}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: statusStyle.bg, color: statusStyle.color }}>{statusStyle.text}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
