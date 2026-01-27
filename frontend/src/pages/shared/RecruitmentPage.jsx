import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../../components/common/Modal.jsx";

export default function RecruitmentPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    positionId: "",
    openings: "",
    status: "OPEN",
    level: ""
  });

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    Promise.all([api.getRecruitment(token), api.getPositions(token)])
      .then(([data, positionsData]) => {
        if (!ignore) {
          setItems(data || []);
          setPositions(positionsData || []);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Failed to load recruitment");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  const positionMap = useMemo(() => {
    const map = new Map();
    positions.forEach((pos) => map.set(pos.id, pos));
    return map;
  }, [positions]);

  const openCreate = () => {
    setFormMode("create");
    setEditing(null);
    setFormData({ positionId: "", openings: "", status: "OPEN", level: "" });
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setFormMode("edit");
    setEditing(item);
    setFormData({
      positionId: String(item.positionId || ""),
      openings: item.openings ?? "",
      status: (item.status || "OPEN").toUpperCase(),
      level: item.description || ""
    });
    setFormError("");
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.positionId) {
      setFormError("Vui lòng chọn vị trí.");
      return;
    }
    const pos = positionMap.get(Number(formData.positionId));
    const payload = {
      title: pos?.name || "Recruitment",
      positionId: Number(formData.positionId),
      departmentId: pos?.departmentId || null,
      openings: formData.openings ? Number(formData.openings) : 1,
      status: formData.status,
      postedAt: new Date().toISOString(),
      description: formData.level || null
    };

    try {
      if (formMode === "create") {
        const created = await api.createRecruitment(token, payload);
        setItems((prev) => [created, ...prev]);
      } else if (editing) {
        const updated = await api.updateRecruitment(token, editing.id, payload);
        setItems((prev) => prev.map((item) => (item.id === editing.id ? { ...item, ...updated } : item)));
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(err.message || "Không thể lưu tuyển dụng");
    }
  };

  const handleDelete = async (item) => {
    await api.deleteRecruitment(token, item.id);
    setItems((prev) => prev.filter((r) => r.id !== item.id));
  };

  if (loading) return <div style={{ padding: 16, fontSize: 12 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: "#b91c1c", fontSize: 12 }}>{error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Recruitment</h1>
      <p style={{ marginTop: 4, color: "#6b7280", fontSize: 12 }}>Quản lý các đợt tuyển dụng</p>

      <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Danh sách tuyển dụng</h3>
          <button onClick={openCreate} style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Tuyển dụng thêm</button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", color: "#6b7280" }}>
                <th style={{ padding: "8px 6px" }}>STT</th>
                <th style={{ padding: "8px 6px" }}>Position</th>
                <th style={{ padding: "8px 6px" }}>Level</th>
                <th style={{ padding: "8px 6px" }}>Số lượng</th>
                <th style={{ padding: "8px 6px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 16, color: "#9ca3af" }}>Chưa có dữ liệu.</td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const pos = positionMap.get(item.positionId);
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 6px" }}>{index + 1}</td>
                      <td style={{ padding: "8px 6px", fontWeight: 600 }}>{pos?.name || item.title || "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{item.description || pos?.description || "-"}</td>
                      <td style={{ padding: "8px 6px" }}>{item.openings ?? 0}</td>
                      <td style={{ padding: "8px 6px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(item)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Sửa</button>
                          <button onClick={() => handleDelete(item)} style={{ border: "1px solid #ef4444", background: "#fff", color: "#ef4444", borderRadius: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>Xóa</button>
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

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title={formMode === "create" ? "Tuyển dụng thêm" : "Chỉnh sửa tuyển dụng"} maxWidth={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Position *</label>
            <select
              value={formData.positionId}
              onChange={(e) => setFormData((prev) => ({ ...prev, positionId: e.target.value }))}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
            >
              <option value="">Chọn vị trí</option>
              {positions.map((pos) => (
                <option key={pos.id} value={pos.id}>{pos.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Số lượng</label>
            <input
              type="number"
              value={formData.openings}
              onChange={(e) => setFormData((prev) => ({ ...prev, openings: e.target.value }))}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 12 }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600 }}>Level</label>
            <input
              type="text"
              value={formData.level}
              onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
              placeholder="VD: Junior / Mid / Senior"
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
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          {formError && <div style={{ color: "#dc2626" }}>{formError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setFormOpen(false)} style={{ border: "1px solid #e5e7eb", background: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Hủy</button>
            <button onClick={handleSubmit} style={{ border: "1px solid #111827", background: "#111827", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>Lưu</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
