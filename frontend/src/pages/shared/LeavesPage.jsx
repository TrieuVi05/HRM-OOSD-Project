import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function normalizeStatus(status) {
  const value = (status || "").toLowerCase();
  if (value.includes("approved") || value.includes("duyet")) return "approved";
  if (value.includes("rejected") || value.includes("tu choi"))
    return "rejected";
  return "pending";
}

export default function LeavesPage() {
  const { token, role } = useAuth();

  const canApprove = role === "HR_ADMIN" || role === "MANAGER";

  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // loading theo từng leave id khi approve/reject
  const [actionLoading, setActionLoading] = useState({}); // { [leaveId]: true/false }

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    Promise.all([api.getLeaves(token), api.getEmployees(token)])
      .then(([leavesData, employeesData]) => {
        if (ignore) return;
        setItems(leavesData || []);
        setEmployees(employeesData || []);
      })
      .catch((err) => {
        if (!ignore)
          setError(err?.message || "Không thể tải dữ liệu nghỉ phép");
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

  const stats = items.reduce(
    (acc, leave) => {
      const status = normalizeStatus(leave.status);
      acc.total += 1;
      if (status === "pending") acc.pending += 1;
      if (status === "approved") acc.approved += 1;
      if (status === "rejected") acc.rejected += 1;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 },
  );

  const setRowLoading = (leaveId, value) => {
    setActionLoading((prev) => ({ ...prev, [leaveId]: value }));
  };

  const updateLeaveInState = (leaveId, updated) => {
    // an toàn: nếu backend trả về null/undefined thì vẫn update state nhẹ
    setItems((prev) =>
      prev.map((x) => {
        if (x.id !== leaveId) return x;
        return updated ? { ...x, ...updated } : { ...x };
      }),
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

  if (loading)
    return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
        Leave Management
      </h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>
        Manage leave requests and balances
      </p>

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Requests</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
            {stats.total}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Pending</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
            {stats.pending}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Approved</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
            {stats.approved}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 14,
          }}
        >
          <div style={{ fontSize: 12, color: "#6b7280" }}>Rejected</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>
            {stats.rejected}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          gap: 8,
          background: "#f3f4f6",
          borderRadius: 999,
          padding: 4,
          marginTop: 16,
        }}
      >
        {[
          { key: "requests", label: "Leave Requests" },
          { key: "balances", label: "Leave Balance" },
          { key: "policies", label: "Policies" },
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
              boxShadow:
                activeTab === tab.key ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "requests" && (
        <div
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
            Leave Requests
          </h3>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {items.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 12 }}>
                No leave requests.
              </div>
            ) : (
              items.map((leave) => {
                const emp = employeeMap.get(leave.employeeId) || leave.employee;
                const status = normalizeStatus(leave.status);
                const isPending = status === "pending";
                const busy = !!actionLoading[leave.id];

                return (
                  <div
                    key={leave.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 12 }}>
                      {emp?.fullName || `Employee #${leave.employeeId}`}
                    </div>

                    <div
                      style={{ color: "#6b7280", fontSize: 11, marginTop: 4 }}
                    >
                      {leave.startDate} → {leave.endDate}
                    </div>

                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      Status: <b>{status}</b>
                    </div>

                    {canApprove && isPending && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button
                          disabled={busy}
                          onClick={() => onApprove(leave)}
                          style={{
                            border: "none",
                            background: busy ? "#86efac" : "#16a34a",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: busy ? "not-allowed" : "pointer",
                            fontWeight: 600,
                          }}
                        >
                          {busy ? "Processing..." : "Approve"}
                        </button>

                        <button
                          disabled={busy}
                          onClick={() => onReject(leave)}
                          style={{
                            border: "none",
                            background: busy ? "#fecaca" : "#dc2626",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: 12,
                            cursor: busy ? "not-allowed" : "pointer",
                            fontWeight: 600,
                          }}
                        >
                          {busy ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab !== "requests" && (
        <div
          style={{
            marginTop: 16,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
            {activeTab === "balances" ? "Leave Balance" : "Policies"}
          </h3>
          <p style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
            This section is ready for future configuration.
          </p>
        </div>
      )}
    </div>
  );
}
