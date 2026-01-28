import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../../components/common/Modal.jsx";

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
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([api.getEmployees(token), api.getAttendance(token), api.getLeaves(token), api.getPayrolls(token)])
      .then(([employeesData, attendanceData, leavesData, payrollsData]) => {
        if (ignore) return;
        setEmployees(employeesData || []);
        setAttendance(attendanceData || []);
        setLeaves(leavesData || []);
        setPayrolls(payrollsData || []);
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
    return employees.find((e) => e.username === user) || employees.find((e) => String(e.employeeCode) === String(user)) || null;
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

  const monthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const daysThisMonth = attendanceForEmployee.filter((a) => {
    if (!a?.workDate) return false;
    const d = new Date(a.workDate);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    return key === monthKey;
  }).length;

  const pendingLeaves = (leaves || []).filter((l) => String(l.employeeId) === String(currentEmployee?.id) && ((l?.status || "").toLowerCase().includes("pending") || l?.status === "PENDING"));

  const latestPayroll = useMemo(() => {
    if (!currentEmployee || payrolls.length === 0) return null;
    const items = payrolls.filter((p) => String(p.employeeId) === String(currentEmployee.id));
    if (items.length === 0) return null;
    items.sort((a, b) => new Date(b.generatedAt || b.periodStart || 0) - new Date(a.generatedAt || a.periodStart || 0));
    return items[0];
  }, [payrolls, currentEmployee]);

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>Tổng quan thông tin làm việc của bạn</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Ngày làm việc tháng này</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{daysThisMonth}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Có mặt hôm nay</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{presentToday}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Đơn chờ duyệt</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{pendingLeaves.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Lương tháng gần nhất</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{latestPayroll ? formatCurrency(latestPayroll.netSalary ?? (Number(latestPayroll.basicSalary || 0) + Number(latestPayroll.allowance || 0) + Number(latestPayroll.bonus || 0) - Number(latestPayroll.deduction || 0))) : "-"}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Chấm Công Gần Đây</h3>
          <div style={{ marginTop: 12 }}>
            {attendanceForEmployee.slice(0, 10).length === 0 ? (
              <div style={{ color: "#9ca3af", padding: 8 }}>Không có bản ghi chấm công.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                    <th style={{ padding: "8px 6px" }}>Ngày</th>
                    <th style={{ padding: "8px 6px" }}>Giờ vào</th>
                    <th style={{ padding: "8px 6px" }}>Giờ ra</th>
                    <th style={{ padding: "8px 6px" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceForEmployee.slice(0, 10).map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 6px" }}>{a.workDate}</td>
                      <td style={{ padding: "8px 6px" }}>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{a.checkOut ? new Date(a.checkOut).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{(a.status || "").toLowerCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Lịch Sử Lương</h3>
          <div style={{ marginTop: 12 }}>
            {payrolls.filter((p) => String(p.employeeId) === String(currentEmployee?.id)).slice(0, 8).length === 0 ? (
              <div style={{ color: "#9ca3af", padding: 8 }}>Không có lịch sử lương.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                    <th style={{ padding: "8px 6px" }}>Kỳ</th>
                    <th style={{ padding: "8px 6px" }}>Lương Cơ Bản</th>
                    <th style={{ padding: "8px 6px" }}>Thực Lãnh</th>
                    <th style={{ padding: "8px 6px" }}>Trạng Thái</th>
                    <th style={{ padding: "8px 6px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.filter((p) => String(p.employeeId) === String(currentEmployee?.id)).slice(0, 8).map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 6px" }}>{p.periodStart ? `${new Date(p.periodStart).toLocaleDateString()} - ${new Date(p.periodEnd || p.periodStart).toLocaleDateString()}` : "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{formatCurrency(p.basicSalary)}</td>
                      <td style={{ padding: "8px 6px" }}>{formatCurrency(p.netSalary ?? (Number(p.basicSalary || 0) + Number(p.allowance || 0) + Number(p.bonus || 0) - Number(p.deduction || 0)))}</td>
                      <td style={{ padding: "8px 6px" }}>{(p.status || "").toLowerCase()}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <button onClick={() => setSelectedPayroll(p)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedPayroll} onClose={() => setSelectedPayroll(null)} title="Employee Payslip" maxWidth={520}>
        {selectedPayroll && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Payslip</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Kỳ: {selectedPayroll.periodStart ? new Date(selectedPayroll.periodStart).toLocaleDateString() : "-"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
              <div>
                <div style={{ color: "#6b7280" }}>Employee</div>
                <div style={{ fontWeight: 600 }}>{currentEmployee?.fullName || currentEmployee?.username || "-"}</div>
              </div>
              <div>
                <div style={{ color: "#6b7280" }}>Employee ID</div>
                <div style={{ fontWeight: 600 }}>{currentEmployee?.employeeCode || currentEmployee?.id}</div>
              </div>
            </div>

            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Earnings</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span>Base Salary</span>
                <span>{formatCurrency(selectedPayroll.basicSalary)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>Deductions</span>
                <span>{formatCurrency(selectedPayroll.deduction)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setSelectedPayroll(null)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
