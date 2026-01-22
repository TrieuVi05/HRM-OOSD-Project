# 03. Frontend

## Yêu cầu

- Node.js 18+
- npm 9+

## Chạy frontend

1. Vào thư mục frontend.
2. Cài dependencies và chạy:
   - `npm install`
   - `npm run dev`

Frontend chạy tại `http://localhost:5173`.

## TODO chi tiết (frontend)

### 1) Chuẩn bị cấu trúc & routing

- Tạo layout chung: `Header`, `Sidebar`, `Footer`.
- Cấu hình router: routes cho `Login`, `Dashboard`, `Employees`, `Departments`, `Attendance`, `Leaves`, `Payroll`, `Recruitment`.
- Tạo `ProtectedRoute` để chặn route khi chưa đăng nhập.

### 2) Authentication (JWT)

- Tạo `AuthContext` lưu `token`, `user`, `role`.
- Lưu token vào `localStorage`.
- Implement `login/logout` gọi API:
   - `POST /api/auth/login`
   - `GET /api/auth/me`
   - `POST /api/auth/logout`
   - `PUT /api/auth/change-password`

### 3) Axios client

- Tạo `api.js` với base URL.
- Thêm interceptor để gắn `Authorization: Bearer <token>`.
- Xử lý lỗi 401 (auto logout).

### 4) CRUD cốt lõi (HRM)

**Employees**
- List + form create/update.
- Call:
   - `GET /api/employees`
   - `POST /api/employees`
   - `PUT /api/employees/{id}`
   - `DELETE /api/employees/{id}`

**Departments / Positions**
- CRUD phòng ban.
- CRUD chức vụ.

### 5) Attendance & Timesheet

- Check-in/out UI.
- Call:
   - `POST /api/attendance/checkin`
   - `POST /api/attendance/checkout`
- Trang lịch sử chấm công.

### 6) Leave Management

- Nhân viên: tạo đơn nghỉ.
- Quản lý: duyệt / từ chối.
- Call:
   - `POST /api/leaves`
   - `PUT /api/leaves/{id}/approve`
   - `PUT /api/leaves/{id}/reject`

### 7) Payroll

- HR: generate payroll theo kỳ.
- Nhân viên: xem payslip.
- Call:
   - `POST /api/payroll/generate`
   - `GET /api/payroll/{id}`

### 8) Recruitment (phụ)

- CRUD tuyển dụng.
- CRUD ứng viên + lịch phỏng vấn.
- Call:
   - `GET /api/recruitments`
   - `GET /api/candidates`
   - `GET /api/interviews`

### 9) Phân quyền UI

- Ẩn/hiện menu theo role (`HR_ADMIN`, `MANAGER`, `EMPLOYEE`).
- Chặn thao tác tạo/sửa/xóa nếu role không đủ quyền.

### 10) Kiểm thử nhanh

- Đăng nhập 3 role mẫu: admin / manager1 / employee1.
- Test check-in/out, approve leave, generate payroll.
