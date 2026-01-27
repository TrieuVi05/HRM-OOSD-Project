import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);
}

function toMonthValue(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function PayrollPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(toMonthValue(new Date()));
  const [activeTab, setActiveTab] = useState("payroll");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([api.getPayrolls(token), api.getEmployees(token)])
      .then(([payrollsData, employeesData]) => {
        if (ignore) return;
        setItems(payrollsData || []);
        setEmployees(employeesData || []);
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

  const employeeMap = useMemo(() => {
    const map = new Map();
    employees.forEach((emp) => map.set(emp.id, emp));
    return map;
  }, [employees]);

  const filteredItems = useMemo(() => {
    if (!selectedMonth) return items;
    return items.filter((payroll) => {
      const dateValue = payroll?.periodStart || payroll?.generatedAt;
      return toMonthValue(dateValue) === selectedMonth;
    });
  }, [items, selectedMonth]);

  const totals = filteredItems.reduce(
    (sum, payroll) => {
      sum.base += Number(payroll.basicSalary || 0);
      sum.allowance += Number(payroll.allowance || 0);
      sum.deduction += Number(payroll.deduction || 0);
      const net = payroll.netSalary ?? (Number(payroll.basicSalary || 0) + Number(payroll.allowance || 0) + Number(payroll.bonus || 0) - Number(payroll.deduction || 0));
      sum.net += Number(net || 0);
      return sum;
    },
    { base: 0, allowance: 0, deduction: 0, net: 0 }
  );

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Payroll Management</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>View payroll data and generate reports</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Net Payroll</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totals.net)}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Current month</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Salaries</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totals.base)}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Base salaries</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Allowances</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totals.allowance)}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Additional benefits</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Deductions</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{formatCurrency(totals.deduction)}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Taxes & others</div>
        </div>
      </div>

      <div style={{ display: "inline-flex", gap: 8, background: "#f3f4f6", borderRadius: 999, padding: 4, marginTop: 16 }}>
        {[
          { key: "payroll", label: "Payroll Data" },
          { key: "reports", label: "Reports & Analytics" }
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

      {activeTab === "payroll" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Monthly Payroll</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
              Month:
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "4px 8px", fontSize: 12 }}
              />
              <button style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Export</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                  <th style={{ padding: "8px 6px" }}>Employee ID</th>
                  <th style={{ padding: "8px 6px" }}>Name</th>
                  <th style={{ padding: "8px 6px" }}>Department</th>
                  <th style={{ padding: "8px 6px" }}>Base Salary</th>
                  <th style={{ padding: "8px 6px" }}>Allowances</th>
                  <th style={{ padding: "8px 6px" }}>Deductions</th>
                  <th style={{ padding: "8px 6px" }}>Net Salary</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                  <th style={{ padding: "8px 6px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: 16, color: "#9ca3af" }}>No payroll data for this month.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const emp = employeeMap.get(item.employeeId) || item.employee;
                    const net = item.netSalary ?? (Number(item.basicSalary || 0) + Number(item.allowance || 0) + Number(item.bonus || 0) - Number(item.deduction || 0));
                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "8px 6px", fontWeight: 600 }}>{emp?.employeeCode || `EMP${item.employeeId}`}</td>
                        <td style={{ padding: "8px 6px" }}>{emp?.fullName || `Employee #${item.employeeId}`}</td>
                        <td style={{ padding: "8px 6px" }}>{emp?.department || "-"}</td>
                        <td style={{ padding: "8px 6px" }}>{formatCurrency(item.basicSalary)}</td>
                        <td style={{ padding: "8px 6px" }}>{formatCurrency(item.allowance)}</td>
                        <td style={{ padding: "8px 6px" }}>{formatCurrency(item.deduction)}</td>
                        <td style={{ padding: "8px 6px", fontWeight: 600 }}>{formatCurrency(net)}</td>
                        <td style={{ padding: "8px 6px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 999, background: "#f3f4f6", fontSize: 11 }}>
                            {(item.status || "pending").toLowerCase()}
                          </span>
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <button style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>View</button>
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

      {activeTab === "reports" && (
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Reports & Analytics</h3>
          <p style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>This section will host payroll analytics and exportable reports.</p>
        </div>
      )}
    </div>
  );
}
