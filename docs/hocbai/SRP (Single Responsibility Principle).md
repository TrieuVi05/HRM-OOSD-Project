# SRP — Single Responsibility Principle (Nguyên tắc Trách nhiệm Đơn)

Mục tiêu: mỗi module/class chỉ có một lý do để thay đổi — tức chỉ đảm nhiệm đúng một trách nhiệm rõ ràng.

## 1. Khái niệm ngắn gọn
- SRP nghĩa là tách các trách nhiệm khác nhau ra thành các lớp hoặc module riêng để dễ hiểu, dễ test và dễ bảo trì.

## 2. Áp dụng SRP trong project này (tóm tắt)
- Backend:
  - Repository: chỉ chịu trách nhiệm truy xuất/persistence. Ví dụ: [backend/src/main/java/com/hrm/HRM/repository/UserRepository.java](backend/src/main/java/com/hrm/HRM/repository/UserRepository.java#L1-L50) và các repository khác đều `extends JpaRepository`.
  - Service: chịu business logic, orchestration, transaction. Ví dụ: [backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java](backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java) — thực hiện tìm, lưu, duyệt đơn nghỉ phép.
  - Controller: chịu HTTP boundary, mapping request → service → response. Ví dụ: `LeaveRequestController` trong `backend/src/main/java/com/hrm/HRM/controller/`.
  - DTOs: các lớp trong `backend/src/main/java/com/hrm/HRM/dto/` (ví dụ `LeaveRequestRequest`, `LeaveRequestResponse`) chỉ chứa dữ liệu biên, không chứa logic.
  - Exceptions: class lỗi (ví dụ `BadRequestException`) chỉ mô tả loại lỗi.

- Frontend:
  - `frontend/src/services/api.js` là network layer: chỉ gọi HTTP, cấu hình header, xử lý lỗi chung.
  - `frontend/src/context/AuthContext.jsx` là auth state: lưu token/user/role và expose helper (`login`/`logout`).
  - `frontend/src/components/common/ProtectedRoute.jsx` chịu trách nhiệm guard route theo role.
  - Pages/UI: các file trong `frontend/src/pages/` chỉ hiển thị dữ liệu và gọi `api`/`useAuth`, không nên chứa business logic nặng.

## 3. Ví dụ minh họa luồng có SRP rõ ràng
- Client gọi API → Controller nhận request (tách nhiệm: HTTP) → Controller gọi Service (tách nhiệm: business) → Service dùng Repository (tách nhiệm: persistence) → Repository trả về entity → Service map entity → trả DTO cho Controller → Controller trả HTTP response.

## 4. Những nơi nên refactor (nâng cao tính SRP)
- Mapping: nếu `*ServiceImpl` chứa nhiều hàm `mapToResponse`/`mapFromRequest`, tách thành `Mapper` riêng (ví dụ `LeaveRequestMapper`) để service chỉ lo nghiệp vụ.
- Validation: nếu service xử lý nhiều validation, tách validator (`LeaveRequestValidator`) để trách nhiệm rõ hơn.
- Controller mỏng: ensure controller chỉ làm mapping + gọi service; di chuyển logic điều kiện/branch lớn vào service.
- Frontend: nếu component tự xử lý header/token thay vì dùng `api.js`/`AuthContext`, chuyển logic đó vào `api.js`.

## 5. Kiểm tra nhanh (checklist SRP khi review code)
- Class có nhiều lý do để thay đổi không? (nhiều loại trách nhiệm → cần tách)
- Mapping có nên tách ra thành mapper riêng không?
- Controller có chứa business logic nặng không? Nếu có — chuyển vào service.
- Service có chứa mapping/validation/logging quá nhiều không? Tách thành helper/validator/mapper.

## 6. Hành động đề nghị (ưu tiên)
1. Tách mapper cho các entity phức tạp (ví dụ mapping leave ↔ DTO).
2. Tạo validators nếu service có nhiều rules.
3. Viết unit test cho mapper và service (mock repository) để tách rõ trách nhiệm.

## 7. Tham khảo các file chính trong repo
- Repositories: [backend/src/main/java/com/hrm/HRM/repository/](backend/src/main/java/com/hrm/HRM/repository/)
- Services: [backend/src/main/java/com/hrm/HRM/service/](backend/src/main/java/com/hrm/HRM/service/)
- Controllers: [backend/src/main/java/com/hrm/HRM/controller/](backend/src/main/java/com/hrm/HRM/controller/)
- DTOs: [backend/src/main/java/com/hrm/HRM/dto/](backend/src/main/java/com/hrm/HRM/dto/)
- Frontend API wrapper: [frontend/src/services/api.js](frontend/src/services/api.js)
- Frontend Auth: [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)
- Frontend guard: [frontend/src/components/common/ProtectedRoute.jsx](frontend/src/components/common/ProtectedRoute.jsx)

---

Nếu bạn muốn, tôi có thể tạo một file audit chi tiết (`SRP-audit.md`) liệt kê từng file kèm đánh giá ngắn (OK / needs refactor) và gợi ý refactor cụ thể. Bạn muốn tôi tạo file đó không?
