import { useState } from 'react';

export default function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  showActions = true,
  searchable = true 
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row =>
    columns.some(column => {
      const value = row[column.field];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const renderCell = (row, column) => {
    const value = row[column.field];
    
    if (column.renderCell) {
      return column.renderCell(row);
    }
    
    if (column.type === 'status') {
      const statusColors = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-blue-100 text-blue-800',
        Rejected: 'bg-red-100 text-red-800'
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100'}`}>
          {value}
        </span>
      );
    }
    
    return value || '-';
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {searchable && (
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {columns.map((column) => (
                <th
                  key={column.field}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    minWidth: column.minWidth || 'auto'
                  }}
                >
                  {column.headerName}
                </th>
              ))}
              {showActions && (
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (showActions ? 1 : 0)} 
                  style={{ padding: '48px 16px', textAlign: 'center', color: '#9ca3af' }}
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map((column) => (
                    <td 
                      key={column.field} 
                      style={{ 
                        padding: '12px 16px', 
                        fontSize: 14,
                        color: '#1f2937'
                      }}
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {showActions && (
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #3b82f6',
                              background: 'transparent',
                              color: '#3b82f6',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 13,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#3b82f6';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#3b82f6';
                            }}
                            title="Xem chi tiết"
                          >
                            👁️
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #10b981',
                              background: 'transparent',
                              color: '#10b981',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 13,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#10b981';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#10b981';
                            }}
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #ef4444',
                              background: 'transparent',
                              color: '#ef4444',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 13,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#ef4444';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{ 
        padding: 16, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderTop: '1px solid #e5e7eb',
        fontSize: 14
      }}>
        <div style={{ color: '#6b7280' }}>
          Hiển thị {page * rowsPerPage + 1} - {Math.min((page + 1) * rowsPerPage, filteredData.length)} của {filteredData.length} kết quả
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            style={{ 
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              fontSize: 13
            }}
          >
            <option value={5}>5/trang</option>
            <option value={10}>10/trang</option>
            <option value={25}>25/trang</option>
            <option value={50}>50/trang</option>
          </select>
          
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              background: page === 0 ? '#f3f4f6' : '#fff',
              borderRadius: 4,
              cursor: page === 0 ? 'not-allowed' : 'pointer',
              fontSize: 13
            }}
          >
            ← Trước
          </button>
          
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            Trang {page + 1} / {totalPages || 1}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d5db',
              background: page >= totalPages - 1 ? '#f3f4f6' : '#fff',
              borderRadius: 4,
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
              fontSize: 13
            }}
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}