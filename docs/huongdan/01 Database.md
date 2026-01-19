# 01. Database

## Yêu cầu

- SQL Server 2019+.
- Tài khoản có quyền tạo database.

## Cấu hình

1. Tạo database và bảng bằng script trong thư mục database:
   - `database/scripted/schema.sql`
2. Cập nhật cấu hình ở `backend/src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=HRM_DB
spring.datasource.username=sa
spring.datasource.password=YourPassword123
```

## Kiểm tra nhanh

- Mở SSMS, kiểm tra DB `HRM_DB` đã có các bảng như `employees`, `departments`, `attendance`.

## Các bảng chính

| Bảng | Mô tả | Quan hệ |
| --- | --- | --- |
| roles | Danh sách vai trò hệ thống | N-N với users qua user_roles |
| users | Tài khoản đăng nhập | N-N với roles qua user_roles; 1-1/1-N với employees |
| user_roles | Bảng nối user-role | FK user_id -> users.id, role_id -> roles.id |
| departments | Phòng ban | 1-N với positions, employees, recruitments |
| positions | Chức vụ | N-1 với departments; 1-N với employees, recruitments |
| employees | Hồ sơ nhân viên | N-1 với departments, positions; 1-N với attendance, timesheets, leaves, payroll, performance_reviews |
| contracts | Hợp đồng lao động | N-1 với employees |
| work_schedules | Lịch/ca làm việc | 1-N với attendance |
| attendance | Chấm công vào/ra | N-1 với employees; N-1 với work_schedules |
| timesheets | Bảng công theo kỳ | N-1 với employees |
| leaves | Nghỉ phép | N-1 với employees; approved_by -> employees.id |
| payroll | Bảng lương theo kỳ | N-1 với employees |
| performance_reviews | Đánh giá hiệu suất | N-1 với employees; reviewer_id -> employees.id |
| recruitments | Tin tuyển dụng | N-1 với departments, positions; 1-N với candidates |
| candidates | Ứng viên | N-1 với recruitments; 1-N với interviews |
| interviews | Lịch phỏng vấn | N-1 với candidates; interviewer_id -> employees.id |
