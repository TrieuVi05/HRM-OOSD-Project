# Phân quyền (Role-Based Access)

Tài liệu này mô tả cách phân quyền theo role trong backend HRM và các endpoint tương ứng.

## 1. Các Role hiện tại

- `HR_ADMIN`: Quản trị/HR Manager (toàn quyền quản lý hệ thống)
- `MANAGER`: Trưởng phòng (duyệt nghỉ phép, xem dữ liệu phòng ban)
- `EMPLOYEE`: Nhân viên (self‑service: chấm công, xem thông tin cá nhân)

> Lưu ý: Trong Spring Security, role được map thành `ROLE_<name>`.

## 2. Cơ chế phân quyền

- Security config bật `@EnableMethodSecurity` để dùng `@PreAuthorize` trên controller.
- `UserDetailsServiceImpl` sẽ load quyền từ bảng `user_roles`.

Files liên quan:

- `security/SecurityConfig.java`
- `security/UserDetailsServiceImpl.java`
- `repository/UserRoleRepository.java`
- `entity/UserRole.java`

## 3. Quy tắc phân quyền (mặc định)

### 3.1 Authentication

- `POST /api/auth/login` → **Public**
- `GET /api/auth/me` → **Authenticated**
- `PUT /api/auth/change-password` → **Authenticated**
- `POST /api/auth/logout` → **Authenticated**

### 3.2 Department

- `GET /api/departments` → **Authenticated**
- `GET /api/departments/{id}` → **Authenticated**
- `POST /api/departments` → **HR_ADMIN**
- `PUT /api/departments/{id}` → **HR_ADMIN**
- `DELETE /api/departments/{id}` → **HR_ADMIN**

### 3.3 Employee

- `GET /api/employees` → **Authenticated**
- `GET /api/employees/{id}` → **Authenticated**
- `POST /api/employees` → **HR_ADMIN**
- `PUT /api/employees/{id}` → **HR_ADMIN**
- `DELETE /api/employees/{id}` → **HR_ADMIN**

### 3.4 Attendance (Chấm công)

- `GET /api/attendance` → **Authenticated**
- `GET /api/attendance/{id}` → **Authenticated**
- `POST /api/attendance` → **HR_ADMIN**
- `POST /api/attendance/checkin` → **HR_ADMIN | MANAGER | EMPLOYEE**
- `POST /api/attendance/checkout` → **HR_ADMIN | MANAGER | EMPLOYEE**
- `PUT /api/attendance/{id}` → **HR_ADMIN**
- `DELETE /api/attendance/{id}` → **HR_ADMIN**

### 3.5 Leave (Nghỉ phép)

- `GET /api/leaves` → **Authenticated**
- `GET /api/leaves/{id}` → **Authenticated**
- `POST /api/leaves` → **Authenticated**
- `PUT /api/leaves/{id}` → **Authenticated**
- `PUT /api/leaves/{id}/approve` → **HR_ADMIN | MANAGER**
- `PUT /api/leaves/{id}/reject` → **HR_ADMIN | MANAGER**
- `DELETE /api/leaves/{id}` → **Authenticated**

### 3.6 Payroll (Lương)

- `GET /api/payroll` → **Authenticated**
- `GET /api/payroll/{id}` → **Authenticated**
- `POST /api/payroll` → **HR_ADMIN**
- `POST /api/payroll/generate` → **HR_ADMIN**
- `PUT /api/payroll/{id}` → **HR_ADMIN**
- `DELETE /api/payroll/{id}` → **HR_ADMIN**

## 4. Muốn thay đổi phân quyền?

Chỉnh trực tiếp annotation `@PreAuthorize` trong controller.
Ví dụ:

```java
@PreAuthorize("hasRole('HR_ADMIN')")
```

Hoặc mở rộng theo nhiều role:

```java
@PreAuthorize("hasAnyRole('HR_ADMIN','MANAGER')")
```

## 5. Gợi ý mở rộng

- Phân quyền theo phòng ban (manager chỉ thấy nhân viên phòng mình).
- Tách quyền “read” và “write” theo role.
- Thêm policy cho module tuyển dụng & đánh giá hiệu suất.
