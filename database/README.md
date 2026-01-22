# Database

Thư mục này chứa các script SQL cho hệ thống HRM (MySQL).

## Nội dung

- `scripted/database.sql`: Schema đầy đủ cho MySQL theo README và đề bài.

## Cách dùng nhanh

1. Mở MySQL Workbench.
2. Chạy script trong `scripted/database.sql` để tạo database và các bảng (MySQL).

> Lưu ý: script sẽ tự tạo database `HRM_DB` nếu chưa có.

## Chi tiết database.sql đang làm gì

1. **Tạo database nếu chưa tồn tại**
	- `CREATE DATABASE HRM_DB` (chỉ chạy khi DB chưa có).
2. **Chuyển ngữ cảnh sang HRM_DB**
	- `USE HRM_DB`.
3. **Tạo các bảng bảo mật & phân quyền** (nếu chưa có)
	- `roles`: danh sách vai trò.
	- `users`: tài khoản đăng nhập.
	- `user_roles`: bảng liên kết nhiều-nhiều giữa `users` và `roles`.
4. **Tạo dữ liệu HR core**
	- `departments`: phòng ban.
	- `positions`: chức vụ theo phòng ban.
	- `employees`: thông tin nhân viên (giữ cột `fullName`, `dateOfBirth`, `department`, `position` để tương thích entity hiện tại).
5. **Hợp đồng & lịch làm việc**
	- `contracts`: hợp đồng nhân viên.
	- `work_schedules`: lịch/ca làm việc.
6. **Chấm công & bảng công**
	- `attendance`: check-in/out theo ngày và ca.
	- `timesheets`: tổng hợp giờ công theo kỳ.
7. **Nghỉ phép**
	- `leaves`: đơn nghỉ phép, trạng thái, người duyệt.
8. **Lương**
	- `payroll`: bảng lương theo kỳ.
	- `net_salary` là cột tính toán: $\text{basic} + \text{allowance} + \text{bonus} - \text{deduction}$.
9. **Đánh giá hiệu suất**
	- `performance_reviews`: đánh giá theo kỳ.
10. **Tuyển dụng**
	- `recruitments`: tin tuyển dụng.
	- `candidates`: ứng viên.
	- `interviews`: lịch phỏng vấn.

## Ràng buộc chính

- Mọi bảng đều được tạo theo kiểu *id BIGINT IDENTITY*.
- Có khóa ngoại đầy đủ giữa nhân viên, phòng ban, chức vụ, chấm công, lương, nghỉ phép và tuyển dụng.
- Toàn bộ bảng dùng `IF OBJECT_ID(...) IS NULL` để tránh tạo trùng.
