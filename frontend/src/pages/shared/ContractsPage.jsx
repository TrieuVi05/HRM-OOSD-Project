import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../../components/common/Modal.jsx";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-CA");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value || 0) + "k ₫";
}

function toInputDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function getStatus(contract) {
  if (contract?.status) return contract.status.toUpperCase();
  if (!contract?.endDate) return "ACTIVE";
  const end = new Date(contract.endDate);
  const today = new Date();
  end.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return end < today ? "EXPIRED" : "ACTIVE";
}

export default function ContractsPage() {
  const { token } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    contractType: "Official",
    startDate: "",
    endDate: "",
    salary: "",
    status: "ACTIVE",
    signedAt: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([api.getContracts(token), api.getEmployees(token)])
      .then(([contractsData, employeesData]) => {
        if (ignore) return;
        setContracts(contractsData || []);
        setEmployees(employeesData || []);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Không thể tải dữ liệu hợp đồng");
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

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let active = 0;
    let expired = 0;
    let expiringSoon = 0;

    contracts.forEach((contract) => {
      const status = getStatus(contract);
      const end = contract.endDate ? new Date(contract.endDate) : null;
      if (status === "EXPIRED" || status === "TERMINATED") expired += 1;
      else active += 1;

      if (end) {
        end.setHours(0, 0, 0, 0);
        const diff = (end - today) / 86400000;
        if (diff >= 0 && diff <= 30) expiringSoon += 1;
      }
    });

    return { active, expired, expiringSoon };
  }, [contracts]);

  const resetForm = () => {
    setFormData({
      employeeId: "",
      contractType: "Official",
      startDate: "",
      endDate: "",
      salary: "",
      status: "ACTIVE",
      signedAt: ""
    });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setFormMode("create");
    setFormOpen(true);
  };

  const openEdit = (contract) => {
    setFormMode("edit");
    setFormData({
      employeeId: String(contract.employeeId || ""),
      contractType: contract.contractType || "Official",
      startDate: contract.startDate || "",
      endDate: contract.endDate || "",
      salary: contract.salary || "",
      status: (contract.status || "ACTIVE").toUpperCase(),
      signedAt: toInputDateTime(contract.signedAt)
    });
    setSelectedContract(contract);
    setFormError("");
    setFormOpen(true);
  };

  const openRenew = (contract) => {
    const newEnd = contract.endDate ? new Date(contract.endDate) : new Date();
    newEnd.setMonth(newEnd.getMonth() + 12);
    const endDate = Number.isNaN(newEnd.getTime()) ? "" : newEnd.toISOString().slice(0, 10);
    setFormMode("renew");
    setFormData({
      employeeId: String(contract.employeeId || ""),
      contractType: contract.contractType || "Official",
      startDate: contract.startDate || "",
      endDate,
      salary: contract.salary || "",
      status: "ACTIVE",
      signedAt: toInputDateTime(contract.signedAt)
    });
    setSelectedContract(contract);
    setFormError("");
    setFormOpen(true);
  };

  const handleTerminate = async (contract) => {
    const payload = {
      employeeId: contract.employeeId,
      contractType: contract.contractType,
      startDate: contract.startDate,
      endDate: contract.endDate,
      salary: contract.salary,
      status: "TERMINATED",
      signedAt: contract.signedAt
    };
    const updated = await api.updateContract(token, contract.id, payload);
    setContracts((prev) => prev.map((item) => (item.id === contract.id ? { ...item, ...updated } : item)));
  };

  const handleSubmit = async () => {
    if (!formData.employeeId || !formData.startDate) {
      setFormError("Vui lòng chọn nhân viên và ngày bắt đầu.");
      return;
    }
    try {
      const payload = {
        employeeId: Number(formData.employeeId),
        contractType: formData.contractType,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        salary: formData.salary ? Number(formData.salary) : 0,
        status: formData.status,
        signedAt: formData.signedAt ? new Date(formData.signedAt).toISOString() : null
      };

      if (formMode === "create") {
        const created = await api.createContract(token, payload);
        setContracts((prev) => [created, ...prev]);
      } else if (selectedContract) {
        const updated = await api.updateContract(token, selectedContract.id, payload);
        setContracts((prev) => prev.map((item) => (item.id === selectedContract.id ? { ...item, ...updated } : item)));
      }

      setFormOpen(false);
      setSelectedContract(null);
      resetForm();
    } catch (err) {
      setFormError(err.message || "Không thể lưu hợp đồng");
    }
  };

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading ...</div>;
  if (error) return <div style={{ padding: 16, color: "#dc2626", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Contract Management</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>Create, manage, and track employee contracts</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Active Contracts</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.active}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Contracts Expiring Soon</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.expiringSoon}</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Next 30 days</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 14 }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Contracts Expired</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{stats.expired}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Contract List</h3>
          <button onClick={openCreate} style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>+ Create Contract</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                <th style={{ padding: "8px 6px" }}>Contract Code</th>
                <th style={{ padding: "8px 6px" }}>Employee Name</th>
                <th style={{ padding: "8px 6px" }}>Contract Type</th>
                <th style={{ padding: "8px 6px" }}>Start Date</th>
                <th style={{ padding: "8px 6px" }}>End Date</th>
                <th style={{ padding: "8px 6px" }}>Status</th>
                <th style={{ padding: "8px 6px" }}>Salary (basic)</th>
                <th style={{ padding: "8px 6px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 16, color: "#9ca3af" }}>No contracts found.</td>
                </tr>
              ) : (
                contracts.map((contract) => {
                  const emp = employeeMap.get(contract.employeeId);
                  const status = getStatus(contract);
                  return (
                    <tr key={contract.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 6px", fontWeight: 600 }}>CT-{String(contract.id).padStart(4, "0")}</td>
                      <td style={{ padding: "8px 6px" }}>{emp?.fullName || `Employee #${contract.employeeId}`}</td>
                      <td style={{ padding: "8px 6px" }}>{contract.contractType || "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{formatDate(contract.startDate)}</td>
                      <td style={{ padding: "8px 6px" }}>{formatDate(contract.endDate)}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 999, background: "#f3f4f6", fontSize: 11 }}>{status.toLowerCase()}</span>
                      </td>
                      <td style={{ padding: "8px 6px" }}>{formatCurrency(contract.salary)}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setSelectedContract(contract)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>View</button>
                          <button onClick={() => openEdit(contract)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => openRenew(contract)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Renew</button>
                          <button onClick={() => handleTerminate(contract)} style={{ border: "1px solid #ef4444", background: "#fff", color: "#ef4444", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Terminate</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedContract} onClose={() => setSelectedContract(null)} title="Contract Detail" maxWidth={720}>
        {selectedContract && (() => {
          const emp = employeeMap.get(selectedContract.employeeId) || {};
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 13 }}>Employee Info</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>Employee Code: <strong>{emp.employeeCode || "-"}</strong></div>
                  <div>Full Name: <strong>{emp.fullName || "-"}</strong></div>
                  <div>Department: <strong>{emp.department || "-"}</strong></div>
                  <div>Position: <strong>{emp.position || "-"}</strong></div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: 13 }}>Contract Info</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>Contract Type: <strong>{selectedContract.contractType || "-"}</strong></div>
                  <div>Contract Duration: <strong>{selectedContract.endDate ? "Fixed" : "Indefinite"}</strong></div>
                  <div>Start Date: <strong>{formatDate(selectedContract.startDate)}</strong></div>
                  <div>End Date: <strong>{formatDate(selectedContract.endDate)}</strong></div>
                  <div>Working Time: <strong>Full-time</strong></div>
                  <div>Working Hours: <strong>08:00 - 17:00</strong></div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: 13 }}>Salary & Allowances</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>Basic Salary: <strong>{formatCurrency(selectedContract.salary)}</strong></div>
                  <div>Allowance: <strong>{formatCurrency(0)}</strong></div>
                  <div>Overtime Rate: <strong>1.5x</strong></div>
                  <div>Payment Cycle: <strong>Monthly</strong></div>
                </div>
              </div>

              <div>
                <h3 style={{ margin: 0, fontSize: 13 }}>Terms</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                  <div>Job Description: <strong>As assigned</strong></div>
                  <div>Benefits: <strong>Standard</strong></div>
                  <div>Notes: <strong>-</strong></div>
                  <div>Attachment: <strong>PDF</strong></div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setSelectedContract(null)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Close</button>
                <button style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Download PDF</button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={formMode === "create" ? "Create Contract" : formMode === "renew" ? "Renew Contract" : "Edit Contract"}
        maxWidth={560}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Employee *</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
            >
              <option value="">Chọn nhân viên</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.employeeCode} - {emp.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Contract Type</label>
            <select
              value={formData.contractType}
              onChange={(e) => setFormData((prev) => ({ ...prev, contractType: e.target.value }))}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
            >
              <option value="Probation">Probation</option>
              <option value="Official">Official</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontWeight: 600 }}>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
              />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontWeight: 600 }}>Basic Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Signed At</label>
            <input
              type="datetime-local"
              value={formData.signedAt}
              onChange={(e) => setFormData((prev) => ({ ...prev, signedAt: e.target.value }))}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
            />
          </div>
          {formError && <div style={{ color: "#dc2626" }}>{formError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setFormOpen(false)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSubmit} style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
