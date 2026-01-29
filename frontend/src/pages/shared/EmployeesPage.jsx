import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";

export default function EmployeesPage() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("employees");

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editingPositionId, setEditingPositionId] = useState(null);

  const [employeeForm, setEmployeeForm] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    position: "",
    status: "ACTIVE",
    joinDate: ""
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    managerUsername: ""
  });

  const [positionForm, setPositionForm] = useState({
    title: "",
    departmentId: "",
    level: ""
  });

  const loadData = () => {
    setLoading(true);
    setError("");
    return Promise.all([
      api.getEmployees(token),
      api.getDepartments(token),
      api.getPositions(token)
    ])
      .then(([employeesData, departmentsData, positionsData]) => {
        setEmployees(employeesData || []);
        setDepartments(departmentsData || []);
        setPositions(positionsData || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let ignore = false;
    loadData().catch(() => {
      if (!ignore) return;
    });
    return () => {
      ignore = true;
    };
  }, [token]);

  const departmentNameById = useMemo(() => {
    const map = new Map();
    departments.forEach((dept) => map.set(dept.id, dept.name));
    return map;
  }, [departments]);

  const parseManager = (description) => {
    if (!description) return "";
    const match = description.match(/^\s*manager\s*:\s*(.+)$/i);
    return match ? match[1].trim() : "";
  };

  const employeeRows = useMemo(() => (
    employees.map((emp) => {
      const rawStatus = (emp.status || "").toLowerCase();
      const displayStatus = rawStatus === "inactive" || rawStatus === "in_active" ? "Inactive" : "Active";
      return {
        id: emp.id,
        name: emp.fullName || emp.username || emp.email || "-",
        email: emp.email || "-",
        department: emp.department || "-",
        position: emp.position || "-",
        status: emp.status ? displayStatus : "Active",
        joinDate: emp.hireDate || "-"
      };
    })
  ), [employees]);

  const departmentRows = useMemo(() => (
    departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      manager: parseManager(dept.description) || "-"
    }))
  ), [departments]);

  const positionRows = useMemo(() => (
    positions.map((pos) => ({
      id: pos.id,
      title: pos.name,
      department: departmentNameById.get(pos.departmentId) || "-",
      level: pos.description || "-"
    }))
  ), [positions, departmentNameById]);

  const employeeColumns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "department", headerName: "Department" },
    { field: "position", headerName: "Position" },
    { field: "status", headerName: "Status", type: "status" },
    { field: "joinDate", headerName: "Join Date" }
  ];

  const departmentColumns = [
    { field: "name", headerName: "Department Name" },
    { field: "manager", headerName: "Manager" }
  ];

  const positionColumns = [
    { field: "title", headerName: "Position Title" },
    { field: "department", headerName: "Department" },
    { field: "level", headerName: "Level" }
  ];

  const resetEmployeeForm = () => {
    setEmployeeForm({
      username: "",
      email: "",
      password: "",
      department: "",
      position: "",
      status: "ACTIVE",
      joinDate: ""
    });
    setEditingEmployeeId(null);
    setEditingEmployee(null);
  };

  const resetDepartmentForm = () => {
    setDepartmentForm({ name: "", managerUsername: "" });
    setEditingDepartmentId(null);
  };
  const resetPositionForm = () => {
    setPositionForm({ title: "", departmentId: "", level: "" });
    setEditingPositionId(null);
  };

  const toDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toISOString().slice(0, 10);
  };

  const handleEditEmployee = (row) => {
    const target = employees.find((emp) => String(emp.id) === String(row.id));
    if (!target) return;
    setEditingEmployeeId(target.id);
    setEditingEmployee(target);
    setEmployeeForm({
      username: target.fullName || "",
      email: target.email || "",
      password: "",
      department: target.department || "",
      position: target.position || "",
      status: target.status || "ACTIVE",
      joinDate: toDateInputValue(target.hireDate)
    });
    setEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = async (row) => {
    if (!row?.id) return;
    const confirmed = window.confirm("Xóa nhân viên này?");
    if (!confirmed) return;
    setSaving(true);
    setEmployeeError("");
    try {
      await api.deleteEmployee(token, row.id);
      await loadData();
      setError("");
      setEmployeeError("");
      setSuccessMessage("Xóa nhân viên thành công");
    } catch (err) {
      setError(err.message || "Failed to delete employee");
    } finally {
      setSaving(false);
    }
  };

  const handleEditDepartment = (row) => {
    const target = departments.find((dept) => String(dept.id) === String(row.id));
    if (!target) return;
    setEditingDepartmentId(target.id);
    setDepartmentForm({
      name: target.name || "",
      managerUsername: parseManager(target.description) || ""
    });
    setDepartmentModalOpen(true);
  };

  const handleDeleteDepartment = async (row) => {
    if (!row?.id) return;
    const confirmed = window.confirm("Xóa phòng ban này?");
    if (!confirmed) return;
    setSaving(true);
    setError("");
        try {
          await api.deleteDepartment(token, row.id);
          await loadData();
          setError("");
    } catch (err) {
      setError(err.message || "Failed to delete department");
    } finally {
      setSaving(false);
    }
  };

  const handleEditPosition = (row) => {
    const target = positions.find((pos) => String(pos.id) === String(row.id));
    if (!target) return;
    setEditingPositionId(target.id);
    setPositionForm({
      title: target.name || "",
      departmentId: target.departmentId ? String(target.departmentId) : "",
      level: target.description || ""
    });
    setPositionModalOpen(true);
  };

  const handleDeletePosition = async (row) => {
    if (!row?.id) return;
    const confirmed = window.confirm("Xóa vị trí này?");
    if (!confirmed) return;
    setSaving(true);
    setError("");
        try {
          await api.deletePosition(token, row.id);
          await loadData();
          setError("");
        } catch (err) {
          setError(err.message || "Failed to delete position");
        } finally {
          setSaving(false);
    }
  };

  const handleSaveEmployee = async () => {
    setSaving(true);
    setError("");
    try {
      const statusValue = employeeForm.status || "ACTIVE";
      if (editingEmployeeId) {
        await api.updateEmployee(token, editingEmployeeId, {
          fullName: employeeForm.username,
          email: employeeForm.email,
          department: employeeForm.department || null,
          position: employeeForm.position || null,
          status: statusValue,
          hireDate: employeeForm.joinDate || null,
          phone: editingEmployee?.phone || null,
          salary: editingEmployee?.salary || null,
          dateOfBirth: editingEmployee?.dateOfBirth || null
        });
      } else {
        await api.createUser({
          username: employeeForm.username,
          passwordHash: employeeForm.password,
          email: employeeForm.email,
          fullName: employeeForm.username,
          status: statusValue
        });

        await api.createEmployee(token, {
          fullName: employeeForm.username,
          email: employeeForm.email,
          department: employeeForm.department || null,
          position: employeeForm.position || null,
          status: statusValue,
          hireDate: employeeForm.joinDate || null
        });
      }

      setEmployeeModalOpen(false);
      resetEmployeeForm();
      setEmployeeError("");
      setSuccessMessage(editingEmployeeId ? "Cập nhật nhân viên thành công" : "Thêm nhân viên thành công");
      await loadData();
    } catch (err) {
      setEmployeeError(err.message || "Failed to add employee");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDepartment = async () => {
    setSaving(true);
    setError("");
    try {
      const managerValue = departmentForm.managerUsername.trim();
      const payload = {
        name: departmentForm.name,
        description: managerValue ? `manager:${managerValue}` : null
      };
      if (editingDepartmentId) {
        await api.updateDepartment(token, editingDepartmentId, payload);
      } else {
        await api.createDepartment(token, payload);
      }
      setDepartmentModalOpen(false);
      resetDepartmentForm();
      setSuccessMessage(editingDepartmentId ? "Cập nhật phòng ban thành công" : "Thêm phòng ban thành công");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to add department");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePosition = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: positionForm.title,
        departmentId: positionForm.departmentId ? Number(positionForm.departmentId) : null,
        description: positionForm.level || null
      };
      if (editingPositionId) {
        await api.updatePosition(token, editingPositionId, payload);
      } else {
        await api.createPosition(token, payload);
      }
      setPositionModalOpen(false);
      resetPositionForm();
      setSuccessMessage(editingPositionId ? "Cập nhật vị trí thành công" : "Thêm vị trí thành công");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to add position");
    } finally {
      setSaving(false);
    }
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!successMessage) return undefined;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 10 }}>
      {successMessage && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#16a34a", color: "#fff", padding: "10px 14px", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.12)", zIndex: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 13 }}>{successMessage}</div>
            <button onClick={() => setSuccessMessage("")} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}
      <h1 style={{ fontSize: 16, marginBottom: 5 }}>Employee & Organization Management</h1>
      <p style={{ color: "#6b7280", marginBottom: 13, fontSize: 10 }}>
        Manage employees, departments, and positions
      </p>

      {error && (
        <div style={{ color: "#b91c1c", padding: 8, borderRadius: 6, background: "#fff5f5", border: "1px solid #fee2e2", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 13 }}>
        {[
          { key: "employees", label: "Employees" },
          { key: "departments", label: "Departments" },
          { key: "positions", label: "Positions" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "5px 10px",
              borderRadius: 5,
              border: "1px solid #e5e7eb",
              background: activeTab === tab.key ? "#111827" : "#f9fafb",
              color: activeTab === tab.key ? "#fff" : "#374151",
              cursor: "pointer",
              fontSize: 10
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 11, color: "#111827" }}>
          {activeTab === "employees" && "Employees"}
          {activeTab === "departments" && "Departments"}
          {activeTab === "positions" && "Positions"}
        </div>
        {activeTab === "employees" && (
          <button
            onClick={() => setEmployeeModalOpen(true)}
            style={{
              padding: "5px 10px",
              borderRadius: 5,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontSize: 10
            }}
          >
            + Add Employee
          </button>
        )}
        {activeTab === "departments" && (
          <button
            onClick={() => setDepartmentModalOpen(true)}
            style={{
              padding: "5px 10px",
              borderRadius: 5,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontSize: 10
            }}
          >
            + Add Department
          </button>
        )}
        {activeTab === "positions" && (
          <button
            onClick={() => setPositionModalOpen(true)}
            style={{
              padding: "5px 10px",
              borderRadius: 5,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              cursor: "pointer",
              fontSize: 10
            }}
          >
            + Add Position
          </button>
        )}
      </div>

      {activeTab === "employees" && (
        <DataTable
          columns={employeeColumns}
          data={employeeRows}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          showActions
        />
      )}
      {activeTab === "departments" && (
        <DataTable
          columns={departmentColumns}
          data={departmentRows}
          onEdit={handleEditDepartment}
          onDelete={handleDeleteDepartment}
          showActions
        />
      )}
      {activeTab === "positions" && (
        <DataTable
          columns={positionColumns}
          data={positionRows}
          onEdit={handleEditPosition}
          onDelete={handleDeletePosition}
          showActions
        />
      )}

      <Modal
        isOpen={employeeModalOpen}
        onClose={() => {
          setEmployeeModalOpen(false);
          resetEmployeeForm();
          setEmployeeError("");
        }}
        title={editingEmployeeId ? "Edit Employee" : "Add New Employee"}
      >
        <div style={{ display: "grid", gap: 10 }}>
            {employeeError && (
            <div style={{ color: "#b91c1c", padding: 8, borderRadius: 6, background: "#fff5f5", border: "1px solid #fee2e2" }}>
              {employeeError}
            </div>
          )}
            {error && (
              <div style={{ color: "#b91c1c", padding: 8, borderRadius: 6, background: "#fff5f5", border: "1px solid #fee2e2" }}>
                {error}
              </div>
            )}
          <label style={{ display: "grid", gap: 6 }}>
            Username
            <input
              value={employeeForm.username}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, username: e.target.value }))}
              required
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Mail
            <input
              type="email"
              value={employeeForm.email}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, email: e.target.value }))}
              required
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
          {!editingEmployeeId && (
            <label style={{ display: "grid", gap: 6 }}>
              Password
              <input
                type="password"
                value={employeeForm.password}
                onChange={(e) => setEmployeeForm((prev) => ({ ...prev, password: e.target.value }))}
                required
                style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
              />
            </label>
          )}
          <label style={{ display: "grid", gap: 6 }}>
            Department
            <select
              value={employeeForm.department}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, department: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Position
            <select
              value={employeeForm.position}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, position: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            >
              <option value="">Select position</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.name}>{pos.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Status
            <select
              value={employeeForm.status}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, status: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Join Date
            <input
              type="date"
              value={employeeForm.joinDate}
              onChange={(e) => setEmployeeForm((prev) => ({ ...prev, joinDate: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 13 }}>
          <button
            onClick={() => {
              setEmployeeModalOpen(false);
              resetEmployeeForm();
              setEmployeeError("");
            }}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={handleSaveEmployee}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={departmentModalOpen}
        onClose={() => {
          setDepartmentModalOpen(false);
          resetDepartmentForm();
        }}
        title={editingDepartmentId ? "Edit Department" : "Add Department"}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Department Name
            <input
              value={departmentForm.name}
              onChange={(e) => setDepartmentForm((prev) => ({ ...prev, name: e.target.value }))}
              required
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Manager (username)
            <input
              value={departmentForm.managerUsername}
              onChange={(e) => setDepartmentForm((prev) => ({ ...prev, managerUsername: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 13 }}>
          <button
            onClick={() => {
              setDepartmentModalOpen(false);
              resetDepartmentForm();
            }}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={handleSaveDepartment}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={positionModalOpen}
        onClose={() => {
          setPositionModalOpen(false);
          resetPositionForm();
        }}
        title={editingPositionId ? "Edit Position" : "Add Position"}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Position Title
            <input
              value={positionForm.title}
              onChange={(e) => setPositionForm((prev) => ({ ...prev, title: e.target.value }))}
              required
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Department
            <select
              value={positionForm.departmentId}
              onChange={(e) => setPositionForm((prev) => ({ ...prev, departmentId: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            Level
            <input
              value={positionForm.level}
              onChange={(e) => setPositionForm((prev) => ({ ...prev, level: e.target.value }))}
              style={{ padding: 6, borderRadius: 5, border: "1px solid #e5e7eb", fontSize: 12 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 13 }}>
          <button
            onClick={() => {
              setPositionModalOpen(false);
              resetPositionForm();
            }}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={handleSavePosition}
            style={{ padding: "6px 10px", borderRadius: 5, border: "1px solid #111827", background: "#111827", color: "#fff", cursor: "pointer", fontSize: 12 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
