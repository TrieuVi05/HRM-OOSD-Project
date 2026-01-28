import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function normalizeLeaveStatus(status) {
  const v = (status || "").toLowerCase();
  if (v.includes("approved") || v.includes("duyet")) return "approved";
  if (v.includes("rejected") || v.includes("tu choi")) return "rejected";
  return "pending";
}

export default function ManagerLeavesReview() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [filter, setFilter] = useState("pending"); // pending | approved | rejected | all
  const [actionLoading, setActionLoading] = useState({});

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [leaveData, empData] = await Promise.all([
        api.getLeaves(token),
        api.getEmployees(token),
      ]);
      setLeaves(leaveData || []);
      setEmployees(empData || []);
    } catch (e) {
      setError(e?.message || "Cannot load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const employeeMap = useMemo(() => {
    const m = new Map();
    employees.forEach((e) => m.set(e.id, e));
    return m;
  }, [employees]);

  const filtered = useMemo(() => {
    if (filter === "all") return leaves;
    return leaves.filter((x) => normalizeLeaveStatus(x.status) === filter);
  }, [leaves, filter]);

  const setRowLoading = (id, v) => setActionLoading((p) => ({ ...p, [id]: v }));

  const updateLeave = (id, updated) => {
    setLeaves((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...updated } : x)),
    );
  };

  const approve = async (leave) => {
    setRowLoading(leave.id, true);
    setError("");
    try {
      const updated = await api.approveLeave(token, leave.id, {
        approvedBy: null,
      });
      updateLeave(leave.id, updated || { status: "APPROVED" });
    } catch (e) {
      setError(e?.message || "Approve failed");
    } finally {
      setRowLoading(leave.id, false);
    }
  };

  const reject = async (leave) => {
    setRowLoading(leave.id, true);
    setError("");
    try {
      const updated = await api.rejectLeave(token, leave.id, {
        approvedBy: null,
      });
      updateLeave(leave.id, updated || { status: "REJECTED" });
    } catch (e) {
      setError(e?.message || "Reject failed");
    } finally {
      setRowLoading(leave.id, false);
    }
  };

  if (loading)
    return <div style={{ padding: 20, fontSize: 12 }}>Loading...</div>;

  return (
    <div
      style={{
        padding: 20,
        background: "#f6f7fb",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 950 }}>
        Review Leave Requests
      </h1>
      <p style={{ marginTop: 6, color: "#6b7280", fontSize: 12 }}>
        Data is fetched from MySQL via API (leaves + employees).
      </p>

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 12,
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {["pending", "approved", "rejected", "all"].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              border: "1px solid #e5e7eb",
              background: filter === k ? "#111827" : "#fff",
              color: filter === k ? "#fff" : "#111827",
              padding: "8px 12px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {k.toUpperCase()}
          </button>
        ))}

        <button
          onClick={fetchData}
          style={{
            marginLeft: "auto",
            border: "1px solid #e5e7eb",
            background: "#fff",
            padding: "8px 12px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px dashed #d1d5db",
              borderRadius: 16,
              padding: 16,
              color: "#6b7280",
              fontSize: 12,
            }}
          >
            No records for this filter.
          </div>
        ) : (
          filtered.map((x) => {
            const emp =
              employeeMap.get(x.employeeId || x.employee_id) || x.employee;
            const st = normalizeLeaveStatus(x.status);
            const busy = !!actionLoading[x.id];

            return (
              <div
                key={x.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 950, fontSize: 13 }}>
                      {emp?.fullName ||
                        emp?.name ||
                        `Employee #${x.employeeId || x.employee_id}`}
                    </div>
                    <div
                      style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}
                    >
                      {x.startDate || x.start_date} → {x.endDate || x.end_date}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12 }}>
                      Status: <b>{st.toUpperCase()}</b>
                    </div>
                  </div>

                  {st === "pending" ? (
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        disabled={busy}
                        onClick={() => approve(x)}
                        style={{
                          border: "none",
                          background: busy ? "#86efac" : "#16a34a",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {busy ? "..." : "Approve"}
                      </button>

                      <button
                        disabled={busy}
                        onClick={() => reject(x)}
                        style={{
                          border: "none",
                          background: busy ? "#fecaca" : "#dc2626",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: busy ? "not-allowed" : "pointer",
                        }}
                      >
                        {busy ? "..." : "Reject"}
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 800,
                      }}
                    >
                      Reviewed
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
