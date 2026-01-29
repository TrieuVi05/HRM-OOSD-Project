import { useEffect, useMemo, useState } from "react";
function LeaveRequestModal({ open, onClose, onSuccess, employeeId, token }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("Nghỉ phép năm");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setStartDate(""); setEndDate(""); setLeaveType("Nghỉ phép năm"); setReason(""); setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      employeeId,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "PENDING",
      approvedBy: null,
      approvedAt: null
    };
    api.createLeave(token, payload)
      .then(() => {
        reset();
        onSuccess && onSuccess();
        onClose && onClose();
      })
      .catch((err) => setError(err?.message || "Không thể gửi đơn nghỉ phép"))
      .finally(() => setLoading(false));
  }

  if (!open) return null;
  return (
    <div style={{ position: "fixed", zIndex: 1000, inset: 0, background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 12, padding: 24, minWidth: 600, boxShadow: "0 2px 16px #0001", border: "1px solid #e5e7eb" }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 18 }}>Tạo Đơn Xin Nghỉ Phép</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Ngày Bắt Đầu</div>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, marginBottom: 4 }}>Ngày Kết Thúc</div>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Loại Nghỉ Phép</div>
          <select value={leaveType} onChange={e => setLeaveType(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }}>
            <option value="Nghỉ phép năm">Nghỉ phép năm</option>
            <option value="Nghỉ ốm">Nghỉ ốm</option>
            <option value="Nghỉ thai sản">Nghỉ thai sản</option>
            <option value="Nghỉ không lương">Nghỉ không lương</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Lý Do</div>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Nhập lý do xin nghỉ phép..." style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #d1d5db" }} />
        </div>
        {error && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={loading} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer" }}>Gửi Đơn</button>
          <button type="button" onClick={() => { reset(); onClose && onClose(); }} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Hủy</button>
        </div>
      </form>
    </div>
  );
}
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUS_MAP = {
  APPROVED: { color: "#22c55e", bg: "#dcfce7", text: "Đã duyệt" },
  PENDING: { color: "#d97706", bg: "#fef3c7", text: "Chờ duyệt" },
  REJECTED: { color: "#dc2626", bg: "#fee2e2", text: "Từ chối" },
};

export default function EmployeeLeavesPage() {
    const [showModal, setShowModal] = useState(false);
  const { token, user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.allSettled([
      api.getLeaves(token),
      api.getEmployees(token)
    ])
      .then(([leavesRes, employeesRes]) => {
        if (ignore) return;
        setLeaves(leavesRes.status === "fulfilled" ? leavesRes.value || [] : []);
        setEmployees(employeesRes.status === "fulfilled" ? employeesRes.value || [] : []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu nghỉ phép");
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

  const leavesForEmployee = useMemo(() => {
    if (!currentEmployee) return [];
    return leaves.filter((l) => String(l.employeeId) === String(currentEmployee.id));
  }, [leaves, currentEmployee]);

  const totalLeaves = leavesForEmployee.length;
  const pendingLeaves = leavesForEmployee.filter((l) => (l.status || "").toUpperCase() === "PENDING").length;
  const approvedLeaves = leavesForEmployee.filter((l) => (l.status || "").toUpperCase() === "APPROVED").length;

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Đơn Nghỉ Phép</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Quản lý đơn xin nghỉ phép của bạn</div>
        </div>
        <button
          style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          onClick={() => setShowModal(true)}
        >
          + Tạo Đơn Mới
        </button>
            <LeaveRequestModal
              open={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                // reload leaves after create
                setLoading(true);
                api.getLeaves(token).then((data) => setLeaves(data || [])).finally(() => setLoading(false));
              }}
              employeeId={currentEmployee?.id}
              token={token}
            />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 18, marginBottom: 18 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#2563eb" }}>📄</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng đơn</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{totalLeaves}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#d97706" }}>⏲️</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Chờ duyệt</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#d97706" }}>{pendingLeaves}</div>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, color: "#22c55e" }}>✅</span>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Đã duyệt</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>{approvedLeaves}</div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 18 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Ngày Bắt Đầu</th>
                <th style={{ padding: 8, textAlign: "left" }}>Ngày Kết Thúc</th>
                <th style={{ padding: 8, textAlign: "left" }}>Loại Nghỉ</th>
                <th style={{ padding: 8, textAlign: "left" }}>Lý Do</th>
                <th style={{ padding: 8, textAlign: "center" }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {leavesForEmployee.length === 0 ? (
                <tr><td colSpan={5} style={{ color: "#9ca3af", textAlign: "center", padding: 16 }}>Không có đơn nghỉ phép.</td></tr>
              ) : (
                leavesForEmployee.map((l) => {
                  const status = (l.status || "PENDING").toUpperCase();
                  const statusStyle = STATUS_MAP[status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={l.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: 8 }}>{l.startDate || "-"}</td>
                      <td style={{ padding: 8 }}>{l.endDate || l.startDate || "-"}</td>
                      <td style={{ padding: 8, fontWeight: 600 }}>{l.leaveType || "Nghỉ phép"}</td>
                      <td style={{ padding: 8 }}>{l.reason || "-"}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, borderRadius: 8, padding: "2px 10px", fontSize: 12 }}>{statusStyle.text}</span>
                      </td>
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
