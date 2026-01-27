export default function HomePage() {
  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>HRM – Employee Management System</h1>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>
        Chọn hướng phù hợp để tiếp tục.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, background: "#fff" }}>
          <h2 style={{ marginTop: 0 }}>A. Khu vực ứng viên</h2>
          <p style={{ color: "#6b7280" }}>
            Dành cho ứng viên bên ngoài: xem tin tuyển dụng, xem chi tiết và nộp CV.
          </p>
          <ul style={{ color: "#6b7280" }}>
            <li>Xem danh sách vị trí tuyển dụng</li>
            <li>Xem chi tiết job</li>
            <li>Nộp hồ sơ không cần tài khoản</li>
          </ul>
          <a
            href="/careers"
            style={{ display: "inline-block", marginTop: 12, padding: "10px 16px", borderRadius: 8, background: "#10b981", color: "#fff", textDecoration: "none" }}
          >
            Vào trang tuyển dụng
          </a>
        </div>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, background: "#fff" }}>
          <h2 style={{ marginTop: 0 }}>B. Hệ thống nội bộ HRM</h2>
          <p style={{ color: "#6b7280" }}>
            Dành cho Admin / HR / Employee. Đăng nhập để truy cập dashboard theo role.
          </p>
          <ul style={{ color: "#6b7280" }}>
            <li>Đăng nhập 1 trang chung</li>
            <li>Tự chuyển hướng theo role</li>
            <li>Quản trị nhân sự, chấm công, lương</li>
          </ul>
          <a
            href="/login"
            style={{ display: "inline-block", marginTop: 12, padding: "10px 16px", borderRadius: 8, background: "#1d4ed8", color: "#fff", textDecoration: "none" }}
          >
            Đăng nhập hệ thống
          </a>
        </div>
      </div>
    </div>
  );
}
