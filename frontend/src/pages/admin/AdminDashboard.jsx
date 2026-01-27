import { useEffect, useMemo, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import StatsCard from "../../components/common/StatsCard.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement);

function formatLocalDate(date) {
  return date.toLocaleDateString("en-CA");
}

function normalizeStatus(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("late") || value.includes("muon")) return "late";
  if (value.includes("absent") || value.includes("vang")) return "absent";
  if (value.includes("present") || value.includes("dilam") || value.includes("on_time")) return "present";
  return "other";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trendMode, setTrendMode] = useState("week");
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    Promise.all([
      api.getEmployees(token),
      api.getAttendance(token),
      api.getLeaves(token),
      api.getPayrolls(token)
    ])
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

  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => map.set(emp.id, emp));
    return map;
  }, [employees]);

  const todayKey = formatLocalDate(new Date());
  const attendanceToday = useMemo(
    () => attendance.filter((item) => item?.workDate === todayKey),
    [attendance, todayKey]
  );

  const attendanceByDate = useMemo(() => {
    const map = new Map();
    attendance.forEach((item) => {
      if (!item?.workDate) return;
      const key = item.workDate;
      if (!map.has(key)) map.set(key, { present: 0, absent: 0, late: 0 });
      const bucket = map.get(key);
      const status = normalizeStatus(item.status);
      if (status === "present") bucket.present += 1;
      if (status === "absent") bucket.absent += 1;
      if (status === "late") bucket.late += 1;
    });
    return map;
  }, [attendance]);

  const attendanceByMonth = useMemo(() => {
    const map = new Map();
    attendance.forEach((item) => {
      if (!item?.workDate) return;
      const date = new Date(item.workDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!map.has(monthKey)) map.set(monthKey, { present: 0, absent: 0, late: 0 });
      const bucket = map.get(monthKey);
      const status = normalizeStatus(item.status);
      if (status === "present") bucket.present += 1;
      if (status === "absent") bucket.absent += 1;
      if (status === "late") bucket.late += 1;
    });
    return map;
  }, [attendance]);

  const totalEmployees = employees.length;
  const presentToday = attendanceToday.filter((item) => normalizeStatus(item.status) === "present").length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

  const pendingLeaves = leaves.filter((leave) => {
    const status = (leave?.status || "").toLowerCase();
    return status === "pending" || status === "chờ" || status.includes("pending");
  });

  const currentMonthKey = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
  const totalPayrollMonthly = payrolls.reduce((sum, payroll) => {
    const dateValue = payroll?.periodStart || payroll?.generatedAt;
    if (!dateValue) return sum;
    const date = new Date(dateValue);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (key !== currentMonthKey) return sum;
    const basic = Number(payroll.basicSalary || 0);
    const allowance = Number(payroll.allowance || 0);
    const bonus = Number(payroll.bonus || 0);
    const deduction = Number(payroll.deduction || 0);
    return sum + basic + allowance + bonus - deduction;
  }, 0);

  const pendingActions = useMemo(() => {
    const actions = [];
    pendingLeaves.forEach((leave) => {
      const emp = employeeMap.get(leave.employeeId);
      actions.push({
        type: "Yêu cầu nghỉ phép",
        title: emp ? emp.fullName : `Nhân viên #${leave.employeeId}`,
        date: leave.startDate || leave.createdAt
      });
    });

    attendanceToday.forEach((item) => {
      const status = normalizeStatus(item.status);
      if (status === "absent" || status === "late") {
        const emp = employeeMap.get(item.employeeId);
        actions.push({
          type: status === "late" ? "Đi muộn" : "Vắng mặt",
          title: emp ? emp.fullName : `Nhân viên #${item.employeeId}`,
          date: item.workDate
        });
      }
    });

    return actions
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 8);
  }, [pendingLeaves, attendanceToday, employeeMap]);

  const departmentStats = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => {
      const dept = emp.department || "Chưa phân phòng ban";
      map.set(dept, (map.get(dept) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [employees]);

  const attendanceLabels = useMemo(() => {
    if (trendMode === "week") {
      return Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return {
          label: date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" }),
          key: formatLocalDate(date)
        };
      });
    }

    return Array.from({ length: 12 }).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - index), 1);
      return {
        label: `Th ${date.getMonth() + 1}`,
        key: `${date.getFullYear()}-${date.getMonth() + 1}`
      };
    });
  }, [trendMode]);

  const attendanceChartData = useMemo(() => {
    const labels = attendanceLabels.map((item) => item.label);
    const presentData = attendanceLabels.map((item) => {
      const data = trendMode === "week" ? attendanceByDate.get(item.key) : attendanceByMonth.get(item.key);
      return data?.present || 0;
    });
    const absentData = attendanceLabels.map((item) => {
      const data = trendMode === "week" ? attendanceByDate.get(item.key) : attendanceByMonth.get(item.key);
      return data?.absent || 0;
    });
    const lateData = attendanceLabels.map((item) => {
      const data = trendMode === "week" ? attendanceByDate.get(item.key) : attendanceByMonth.get(item.key);
      return data?.late || 0;
    });

    return {
      labels,
      datasets: [
        { label: "Đi làm", data: presentData, backgroundColor: "#3b82f6" },
        { label: "Vắng mặt", data: absentData, backgroundColor: "#ef4444" },
        { label: "Đi muộn", data: lateData, backgroundColor: "#f59e0b" }
      ]
    };
  }, [attendanceLabels, attendanceByDate, attendanceByMonth, trendMode]);

  const departmentChartData = useMemo(() => ({
    labels: departmentStats.map((item) => item.name),
    datasets: [
      {
        data: departmentStats.map((item) => item.value),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#14b8a6", "#f97316"]
      }
    ]
  }), [departmentStats]);

  if (loading) return <div style={{ padding: 12, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 12, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 12 }}>
      <h1 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Tổng quan Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 10, fontSize: 11 }}>Chào mừng bạn! Đây là tình hình hôm nay.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
        <StatsCard title="Tổng nhân viên" value={totalEmployees} icon="👥" color="blue" />
        <StatsCard title="Chấm công hôm nay" value={`${presentToday}/${totalEmployees}`} icon="⏰" color="green" trend="up" trendValue={`${attendanceRate}%`} />
        <StatsCard title="Yêu cầu nghỉ phép" value={pendingLeaves.length} icon="📌" color="yellow" />
        <StatsCard title="Tổng lương (tháng)" value={formatCurrency(totalPayrollMonthly)} icon="💰" color="purple" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 8, marginTop: 10 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>Xu hướng chấm công</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setTrendMode("week")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 5,
                  border: "1px solid #e5e7eb",
                  background: trendMode === "week" ? "#3b82f6" : "#fff",
                  color: trendMode === "week" ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontSize: 11
                }}
              >
                Tuần
              </button>
              <button
                onClick={() => setTrendMode("month")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 5,
                  border: "1px solid #e5e7eb",
                  background: trendMode === "month" ? "#3b82f6" : "#fff",
                  color: trendMode === "month" ? "#fff" : "#374151",
                  cursor: "pointer",
                  fontSize: 11
                }}
              >
                Tháng
              </button>
            </div>
          </div>
          <Bar
            data={attendanceChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" }, tooltip: { enabled: true } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>

        <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6" }}>
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Việc cần xử lý</h3>
          {pendingActions.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 11 }}>Không có việc cần xử lý.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pendingActions.map((item, index) => (
                <div key={`${item.type}-${index}`} style={{ padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{item.type}</div>
                  <div style={{ fontWeight: 600, fontSize: 12 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{item.date ? new Date(item.date).toLocaleDateString("vi-VN") : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8, marginTop: 10 }}>
        <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6" }}>
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Nhân viên theo phòng ban</h3>
          {departmentStats.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 11 }}>Chưa có dữ liệu phòng ban.</p>
          ) : (
            <Pie data={departmentChartData} options={{ plugins: { legend: { position: "bottom" } } }} />
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 8, padding: 10, border: "1px solid #f3f4f6" }}>
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Thống kê nhanh</h3>
          <ul style={{ margin: 0, paddingLeft: 14, color: "#4b5563", fontSize: 11 }}>
            <li>Tổng nhân viên: {totalEmployees}</li>
            <li>Đi làm hôm nay: {presentToday}</li>
            <li>Yêu cầu nghỉ phép chờ duyệt: {pendingLeaves.length}</li>
            <li>Tổng lương tháng hiện tại: {formatCurrency(totalPayrollMonthly)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
