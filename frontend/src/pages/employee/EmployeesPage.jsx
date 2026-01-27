import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";

const emptyForm = {
  id: "",
  fullName: "",
  email: "",
  departmentName: "",
  status: "Active",
};

export default function EmployeesPage() {
  const { token, role } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // modal states
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);

  const canManage = role === "HR_ADMIN" || role === "MANAGER";
  const canDelete = role === "HR_ADMIN";

  const loadEmployees = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await api.getEmployees(token);
      // normalize để DataTable dễ search
      const normalized = (data || []).map((e) => ({
        id: e.id,
        fullName: e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim(),
        email: e.email || "",
        departmentName: e.department?.name || e.departmentName || "",
        status: e.status || "Active",
        raw: e,
      }));
      setItems(normalized);
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", minWidth: 80 },
      { field: "fullName", headerName: "Họ tên", minWidth: 180 },
      { field: "email", headerName: "Email", minWidth: 220 },
      { field: "departmentName", headerName: "Phòng ban", minWidth: 160 },
      { field: "status", headerName: "Trạng thái", type: "status", minWidth: 120 },
    ],
    []
  );

  const openCreate = () => {
    setFormMode("create");
    setForm(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (row) => {
    setFormMode("edit");
    setForm({
      id: row.id,
      fullName: row.fullName || "",
      email: row.email || "",
      departmentName: row.departmentName || "",
      status: row.status || "Active",
    });
    setOpenForm(true);
  };

  const openDetail = (row) => {
    setSelected(row);
    setOpenView(true);
  };

  const onDelete = async (row) => {
    if (!canDelete) return;
    const ok = confirm(`Xóa nhân viên "${row.fullName}"?`);
    if (!ok) return;

    try {
      await api.deleteEmployee(token, row.id);
      await loadEmployees();
    } catch (err) {
      alert(err.message || "Xóa thất bại");
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // validate tối thiểu
    if (!form.fullName.trim()) return alert("Vui lòng nhập họ tên");
    if (!form.email.trim()) return alert("Vui lòng nhập email");

    const payload = {
      fullName: form.fullName,
      email: form.email,
      status: form.status,
      // sau này bạn đổi thành departmentId
      departmentName: form.departmentName,
    };

    try {
      if (formMode === "create") {
        await api.createEmployee(token, payload);
      } else {
        await api.updateEmployee(token, form.id, payload);
      }
      setOpenForm(false);
      await loadEmployees();
    } catch (err) {
      alert(err.message || "Lưu thất bại");
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: "#b91c1c" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Nhân viên</h1>

        {canManage && (
          <button
            onClick={openCreate}
            style={{
              padding: "10px 14px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            + Thêm nhân viên
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={items}
        onView={openDetail}
        onEdit={canManage ? openEdit : undefined}
        onDelete={canDelete ? onDelete : undefined}
      />

      {/* MODAL: Create/Edit */}
      <Modal
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        title={formMode === "create" ? "Thêm nhân viên" : "Chỉnh sửa nhân viên"}
      >
        <form onSubmit={onSubmitForm} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            Họ tên
            <input
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="VD: Nguyễn Văn A"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="VD: a@gmail.com"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Phòng ban
            <input
              value={form.departmentName}
              onChange={(e) => setForm((p) => ({ ...p, departmentName: e.target.value }))}
              placeholder="VD: IT / HR / Sales..."
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            Trạng thái
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #d1d5db" }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontWeight: 600 }}
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: View detail */}
      <Modal isOpen={openView} onClose={() => setOpenView(false)} title="Chi tiết nhân viên" maxWidth={520}>
        {!selected ? (
          <div>Không có dữ liệu</div>
        ) : (
          <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
            <div><b>ID:</b> {selected.id}</div>
            <div><b>Họ tên:</b> {selected.fullName || "-"}</div>
            <div><b>Email:</b> {selected.email || "-"}</div>
            <div><b>Phòng ban:</b> {selected.departmentName || "-"}</div>
            <div><b>Trạng thái:</b> {selected.status || "-"}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
