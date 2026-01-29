import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatCurrency(value) {
  if (value == null) return "-";
  const formatted = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value || 0);
  return `${formatted} ₫`;
}

export default function EmployeePayrollPage() {
  const { token, user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      api.getPayrolls(token),
      api.getEmployees(token)
    ])
      .then(([payrollsRes, employeesRes]) => {
        if (ignore) return;
        setPayrolls(payrollsRes.status === "fulfilled" ? payrollsRes.value || [] : []);
        setEmployees(employeesRes.status === "fulfilled" ? employeesRes.value || [] : []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu lương");
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

  const payrollsForEmployee = useMemo(() => {
    if (!currentEmployee) return [];
    return payrolls.filter((p) => String(p.employeeId) === String(currentEmployee.id));
  }, [payrolls, currentEmployee]);

  const latestPayroll = useMemo(() => {
    if (payrollsForEmployee.length === 0) return null;
    const items = [...payrollsForEmployee];
    items.sort((a, b) => new Date(b.generatedAt || b.periodStart || 0) - new Date(a.generatedAt || a.periodStart || 0));
    return items[0];
  }, [payrollsForEmployee]);

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Lương</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>Thông tin lương và thu nhập của bạn</div>
      <div style={{ background: "#2563eb", color: "#fff", borderRadius: 14, padding: 24, marginBottom: 18, position: "relative" }}>
        <div style={{ fontSize: 13, opacity: 0.95 }}>Lương Tháng Gần Nhất</div>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 6 }}>{formatCurrency(latestPayroll?.netSalary ?? (Number(latestPayroll?.basicSalary || 0) + Number(latestPayroll?.allowance || 0) + Number(latestPayroll?.bonus || 0) - Number(latestPayroll?.deduction || 0)))}</div>
        <div style={{ fontSize: 12, marginTop: 8, opacity: 0.95 }}>
          {latestPayroll?.periodStart && latestPayroll?.periodEnd ? (
            <>
              <span style={{ marginRight: 4 }}>📅</span>
              {latestPayroll.periodStart} - {latestPayroll.periodEnd}
            </>
          ) : null}
        </div>
        <div style={{ position: "absolute", top: 18, right: 24, fontSize: 32, opacity: 0.2 }}>💲</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#2563eb" }}>💵</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Lương Cơ Bản</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(latestPayroll?.basicSalary)}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#22c55e" }}>💸</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Phụ Cấp</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>+{formatCurrency(latestPayroll?.allowance)}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#a21caf" }}>📈</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Thưởng</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a21caf" }}>+{formatCurrency(latestPayroll?.bonus)}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#dc2626" }}>💳</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Khấu Trừ</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#dc2626" }}>-{formatCurrency(latestPayroll?.deduction)}</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Lịch Sử Lương</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Kỳ Lương</th>
                <th style={{ padding: 8, textAlign: "right" }}>Lương Cơ Bản</th>
                <th style={{ padding: 8, textAlign: "right" }}>Phụ Cấp</th>
                <th style={{ padding: 8, textAlign: "right" }}>Thưởng</th>
                <th style={{ padding: 8, textAlign: "right" }}>Khấu Trừ</th>
                <th style={{ padding: 8, textAlign: "right" }}>Thực Lãnh</th>
                <th style={{ padding: 8, textAlign: "center" }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {payrollsForEmployee.length === 0 ? (
                <tr><td colSpan={7} style={{ color: "#9ca3af", textAlign: "center", padding: 16 }}>Không có dữ liệu lương.</td></tr>
              ) : (
                payrollsForEmployee.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 8 }}>{p.periodStart} - {p.periodEnd}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{formatCurrency(p.basicSalary)}</td>
                    <td style={{ padding: 8, textAlign: "right", color: "#22c55e" }}>+{formatCurrency(p.allowance)}</td>
                    <td style={{ padding: 8, textAlign: "right", color: "#a21caf" }}>+{formatCurrency(p.bonus)}</td>
                    <td style={{ padding: 8, textAlign: "right", color: "#dc2626" }}>-{formatCurrency(p.deduction)}</td>
                    <td style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>{formatCurrency(p.netSalary ?? (Number(p.basicSalary || 0) + Number(p.allowance || 0) + Number(p.bonus || 0) - Number(p.deduction || 0)))}</td>
                    <td style={{ padding: 8, textAlign: "center" }}>
                      {p.status && String(p.status).toLowerCase().includes("paid") ? (
                        <span style={{ background: "#dcfce7", color: "#22c55e", borderRadius: 8, padding: "2px 10px", fontSize: 12 }}>Đã thanh toán</span>
                      ) : (
                        <span style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "2px 10px", fontSize: 12 }}>Chưa thanh toán</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
