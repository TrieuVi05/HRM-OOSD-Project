import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Modal from "../../components/common/Modal.jsx";

import { useEffect, useState } from "react";

// Component DataTable inline
function DataTable({ columns, data, onEdit, onDelete, onView, showActions = true, searchable = true }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row =>
    columns.some(column => {
      const value = row[column.field];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const renderCell = (row, column) => {
    const value = row[column.field];
    if (column.renderCell) return column.renderCell(row);
    if (column.type === 'status') {
      return <span style={{padding: '4px 8px', borderRadius: 12, fontSize: 12, background: value === 'Active' ? '#f0fdf4' : '#f3f4f6', color: value === 'Active' ? '#10b981' : '#6b7280', fontWeight: 500}}>{value}</span>;
    }
    return value || '-';
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {searchable && (
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
          <input type="text" placeholder="🔍 Tìm kiếm..." style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            {columns.map((col) => <th key={col.field} style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>{col.headerName}</th>)}
            {showActions && <th style={{ padding: 12, textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Hành động</th>}
          </tr></thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                {columns.map((col) => <td key={col.field} style={{ padding: 12, fontSize: 14 }}>{renderCell(row, col)}</td>)}
                {showActions && (
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {onView && <button onClick={() => onView(row)} style={{ padding: '4px 8px', border: '1px solid #3b82f6', background: '#fff', color: '#3b82f6', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>👁️</button>}
                      {onEdit && <button onClick={() => onEdit(row)} style={{ padding: '4px 8px', border: '1px solid #10b981', background: '#fff', color: '#10b981', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✏️</button>}
                      {onDelete && <button onClick={() => onDelete(row)} style={{ padding: '4px 8px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>🗑️</button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', fontSize: 13 }}>
        <div>Hiển thị {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredData.length)} của {filteredData.length}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4 }}>
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={25}>25/trang</option>
          </select>
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.5 : 1 }}>←</button>
          <span>Trang {page + 1}/{totalPages || 1}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 4, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.5 : 1 }}>→</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, maxWidth = 600 }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, maxWidth, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6b7280' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    status: 'Active'
  });

  useEffect(() => {
    setTimeout(() => {
      setItems([
        { id: 1, fullName: 'Nguyễn Văn An', email: 'nguyenvanan@company.com', phone: '0901234567', department: { name: 'IT' }, position: 'Senior Developer', status: 'Active', joinDate: '2022-01-15' },
        { id: 2, fullName: 'Trần Thị Bích', email: 'tranthib@company.com', phone: '0902345678', department: { name: 'HR' }, position: 'HR Manager', status: 'Active', joinDate: '2021-06-10' },
        { id: 3, fullName: 'Lê Văn Cường', email: 'levanc@company.com', phone: '0903456789', department: { name: 'Sales' }, position: 'Sales Representative', status: 'Inactive', joinDate: '2023-03-20' },
        { id: 4, fullName: 'Phạm Thị Dung', email: 'phamthid@company.com', phone: '0904567890', department: { name: 'Marketing' }, position: 'Marketing Manager', status: 'Active', joinDate: '2020-11-05' },
        { id: 5, fullName: 'Hoàng Văn Em', email: 'hoangvane@company.com', phone: '0905678901', department: { name: 'IT' }, position: 'UI/UX Designer', status: 'Active', joinDate: '2023-07-12' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 60 },
    { field: 'fullName', headerName: 'Họ và tên', minWidth: 180 },
    { field: 'email', headerName: 'Email', minWidth: 220 },
    { field: 'phone', headerName: 'Số điện thoại', minWidth: 130 },
    { field: 'department', headerName: 'Phòng ban', minWidth: 120, renderCell: (row) => row.department?.name || '-' },
    { field: 'position', headerName: 'Chức vụ', minWidth: 150 },
    { field: 'status', headerName: 'Trạng thái', minWidth: 100, type: 'status' },
  ];

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsViewMode(false);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department?.name || '',
      position: employee.position,
      status: employee.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (employee) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên "${employee.fullName}"?`)) {
      setItems(items.filter(e => e.id !== employee.id));
    }
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setIsViewMode(false);
    setFormData({ fullName: '', email: '', phone: '', department: '', position: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email || !formData.department || !formData.position) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    
    if (selectedEmployee) {
      setItems(items.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...formData, department: { name: formData.department } }
          : emp
      ));
    } else {
      const newEmployee = {
        id: items.length + 1,
        ...formData,
        department: { name: formData.department },
        joinDate: new Date().toISOString().split('T')[0]
      };
      setItems([...items, newEmployee]);
    }
    
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>⏳</div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 4 }}>👥 Quản lý Nhân viên</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Quản lý thông tin nhân viên trong hệ thống</p>
        </div>
        <button onClick={handleAddNew} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          + Thêm nhân viên mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>TỔNG NHÂN VIÊN</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1f2937' }}>{items.length}</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>ĐANG LÀM VIỆC</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>{items.filter(e => e.status === 'Active').length}</div>
        </div>
        <div style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>NGHỈ VIỆC</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#ef4444' }}>{items.filter(e => e.status === 'Inactive').length}</div>
        </div>
      </div>

      <DataTable columns={columns} data={items} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} showActions={true} searchable={true} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isViewMode ? '👁️ Chi tiết nhân viên' : (selectedEmployee ? '✏️ Chỉnh sửa nhân viên' : '➕ Thêm nhân viên mới')} maxWidth={700}>
        {isViewMode && selectedEmployee ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>ID:</div>
              <div>{selectedEmployee.id}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Họ và tên:</div>
              <div>{selectedEmployee.fullName}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Email:</div>
              <div>{selectedEmployee.email}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Số điện thoại:</div>
              <div>{selectedEmployee.phone}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Phòng ban:</div>
              <div>{selectedEmployee.department?.name}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Chức vụ:</div>
              <div>{selectedEmployee.position}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Ngày vào làm:</div>
              <div>{selectedEmployee.joinDate}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, padding: '12px 0' }}>
              <div style={{ fontWeight: 600, color: '#6b7280' }}>Trạng thái:</div>
              <div><span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 12, background: selectedEmployee.status === 'Active' ? '#f0fdf4' : '#f3f4f6', color: selectedEmployee.status === 'Active' ? '#10b981' : '#6b7280', fontWeight: 500 }}>{selectedEmployee.status}</span></div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} placeholder="email@company.com" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} placeholder="0901234567" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Phòng ban <span style={{ color: '#ef4444' }}>*</span></label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}>
                  <option value="">-- Chọn phòng ban --</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Chức vụ <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }} placeholder="Developer, Manager..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#374151' }}>Trạng thái</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}>
                  <option value="Active">Đang làm việc</option>
                  <option value="Inactive">Đã nghỉ việc</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #d1d5db', background: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSubmit} style={{ padding: '10px 20px', border: 'none', background: '#3b82f6', color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{selectedEmployee ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
