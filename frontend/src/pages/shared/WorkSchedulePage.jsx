import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";

export default function WorkSchedulePage() {
  const { token, role } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    startTime: "08:00",
    endTime: "17:00",
    daysOfWeek: "Mon,Tue,Wed,Thu,Fri",
    description: ""
  });

  const loadData = () => {
    setLoading(true);
    setError("");
    return api.getWorkSchedules(token)
      .then((data) => setSchedules(data || []))
      .catch((err) => setError(err.message || "Failed to load schedules"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [token]);

  const rows = useMemo(() => (
    schedules.map(s => ({
      id: s.id,
      name: s.name,
      time: `${s.startTime || '-'} → ${s.endTime || '-'}`,
      days: s.daysOfWeek || '-',
      description: s.description || '-'
    }))
  ), [schedules]);

  const columns = [
    { field: 'name', headerName: 'Tên lịch' },
    { field: 'time', headerName: 'Giờ' },
    { field: 'days', headerName: 'Ngày trong tuần' },
    { field: 'description', headerName: 'Mô tả' }
  ];

  const handleEdit = (row) => {
    if (role === "EMPLOYEE") return;
    const s = schedules.find(x => String(x.id) === String(row.id));
    if (!s) return;
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      startTime: s.startTime || '08:00',
      endTime: s.endTime || '17:00',
      daysOfWeek: s.daysOfWeek || '',
      description: s.description || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (role === "EMPLOYEE") return;
    if (!row?.id) return;
    const ok = window.confirm('Xóa lịch làm việc này?');
    if (!ok) return;
    setSaving(true);
    setError('');
    try {
      await api.deleteWorkSchedule(token, row.id);
      await loadData();
      setSuccessMessage('Xóa lịch thành công');
    } catch (err) {
      setError(err.message || 'Failed to delete schedule');
    } finally { setSaving(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (editingId) {
        await api.updateWorkSchedule(token, editingId, payload);
        setSuccessMessage('Cập nhật lịch thành công');
      } else {
        await api.createWorkSchedule(token, payload);
        setSuccessMessage('Tạo lịch thành công');
      }
      setModalOpen(false);
      setEditingId(null);
      setForm({ name: '', startTime: '08:00', endTime: '17:00', daysOfWeek: 'Mon,Tue,Wed,Thu,Fri', description: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save schedule');
    } finally { setSaving(false); }
  };

  useEffect(() => {
    if (!successMessage) return undefined;
    const t = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  if (loading) return <div style={{ padding: 24 }}>Loading schedules...</div>;

  return (
    <div style={{ padding: 12 }}>
      {successMessage && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#16a34a", color: "#fff", padding: "10px 14px", borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.12)", zIndex: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 13 }}>{successMessage}</div>
            <button onClick={() => setSuccessMessage("")} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: 16, marginBottom: 6 }}>Lịch làm việc</h1>
      <p style={{ color: "#6b7280", marginBottom: 12, fontSize: 12 }}>Quản lý ca và lịch làm việc của nhân viên</p>

      {error && (
        <div style={{ color: "#b91c1c", padding: 8, borderRadius: 6, background: "#fff5f5", border: "1px solid #fee2e2", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 12 }}>Danh sách lịch</div>
        <div>
          {role !== "EMPLOYEE" && (
            <button onClick={() => { setModalOpen(true); setEditingId(null); setForm({ name: '', startTime: '08:00', endTime: '17:00', daysOfWeek: 'Mon,Tue,Wed,Thu,Fri', description: '' }); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #111827', background: '#111827', color: '#fff', cursor: 'pointer', fontSize: 12 }}>+ Thêm lịch</button>
          )}
        </div>
      </div>

      <DataTable columns={columns} data={rows} onEdit={role === "EMPLOYEE" ? undefined : handleEdit} onDelete={role === "EMPLOYEE" ? undefined : handleDelete} showActions={role !== "EMPLOYEE"} />

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(''); }} title={editingId ? 'Chỉnh sửa lịch' : 'Tạo lịch'}>
        <div style={{ display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            Tên lịch
            <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label style={{ display: 'grid', gap: 6, flex: 1 }}>
              Bắt đầu
              <input type="time" value={form.startTime} onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </label>
            <label style={{ display: 'grid', gap: 6, flex: 1 }}>
              Kết thúc
              <input type="time" value={form.endTime} onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </label>
          </div>
          <label style={{ display: 'grid', gap: 6 }}>
            Ngày trong tuần (phân tách bằng dấu phẩy, vd: Mon,Tue,Wed)
            <input value={form.daysOfWeek} onChange={(e) => setForm(prev => ({ ...prev, daysOfWeek: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            Mô tả
            <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', minHeight: 80 }} />
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={() => { setModalOpen(false); setError(''); }} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff' }}>Hủy</button>
          <button disabled={saving} onClick={handleSave} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #111827', background: '#111827', color: '#fff' }}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </Modal>
    </div>
  );
}
