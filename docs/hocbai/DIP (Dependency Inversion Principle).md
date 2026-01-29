# DIP — Dependency Inversion Principle (Nguyên tắc Đảo ngược Phụ thuộc)

Mục tiêu: các module cấp cao không nên phụ thuộc vào module cấp thấp — cả hai nên phụ thuộc vào abstraction (interface/contract). Abstraction không nên phụ thuộc vào chi tiết; chi tiết nên phụ thuộc vào abstraction.

## 1. Khái niệm ngắn gọn
- DIP khuyến khích viết code theo hướng phụ thuộc vào interface (hoặc abstraction) thay vì implementation cụ thể. Điều này cho phép thay thế implementation dễ dàng, tăng khả năng test và tuân OCP/LSP.

## 2. Tại sao DIP quan trọng trong project này
- Giúp tách module cao cấp (controller, orchestration services) khỏi chi tiết thấp (repository, http client, third-party services), làm cho unit test dễ viết và thay implementation (ví dụ mock repository, swap http client) không gây thay đổi phần còn lại.

## 3. Áp dụng DIP trong repo (tóm tắt)
- **Service interfaces**: controllers gọi `SomeService` (interface) thay vì `SomeServiceImpl` — controller phụ thuộc abstraction.
- **Repository interfaces**: controllers/services gọi `UserRepository` (interface) — Spring cung cấp implementation, và chúng ta có thể thay bằng mock hoặc custom impl.
- **Frontend**: components dùng `useAuth()` hook hoặc gọi các function từ `api` module (abstraction). Nếu cần đổi cách gọi HTTP, chỉ sửa `api.js` implementation.

## 4. Ví dụ cụ thể trong repo
- Backend:
	- `UserController` gọi `UserService` (interface) — `UserServiceImpl` được inject qua Spring. Controller không biết chi tiết impl.
	- `JwtAuthenticationFilter` tiêu thụ `UserDetailsService` abstraction để load user details.
- Frontend:
	- `AuthContext` cung cấp hook/abstraction; components không gọi localStorage trực tiếp.
	- `api.js` là abstraction cho HTTP client; components call `api.getXXX()`.

## 5. Dấu hiệu vi phạm DIP
- Controller khởi tạo trực tiếp implementation: `new SomeServiceImpl()` hoặc gọi method cụ thể của impl thay vì interface.
- Code phụ thuộc trực tiếp vào `fetch`/`axios` ở nhiều component thay vì dùng `api.js` wrapper.
- Module cao cấp gọi chi tiết (ví dụ controller trực tiếp gọi `EntityManager` hoặc SQL) thay vì dùng repository abstraction.

## 6. Kiểm tra/Refactor checklist
1. Controller classes: kiểm tra mọi injection; đảm bảo phụ thuộc là interface/service contract, không phải impl cụ thể.
2. Service classes: nếu nội bộ service cần dùng helper (http client, cache), inject abstraction (interface) thay vì concrete class.
3. Frontend components: đảm bảo dùng `api`/`auth` abstraction, không gọi fetch/localStorage trực tiếp.

## 7. Hành động đề nghị (ưu tiên)
1. Introduce interfaces for heavy dependencies: nếu một phần code sử dụng external service (email, payment, notification), tạo `NotificationSender` interface và bind concrete implementation trong config/DI container.
2. Wrap side-effectful APIs: nếu code spread `fetch` calls, centralize into `api.js` and inject that abstraction into components/hooks.
3. Use DI for testing: ensure tests can inject mocks for `UserRepository`, `LeaveRequestRepository`, `SomeExternalService`.

## 8. Quick audit points (file liên quan và đánh giá ngắn)
- `backend/src/main/java/com/hrm/HRM/controller/UserController.java` — OK
	- Lý do: controller dùng `UserService` abstraction (injected), tuân DIP.
- `backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java` — OK
	- Lý do: sử dụng `UserDetailsService` abstraction; không phụ thuộc chi tiết.
- `backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java` — monitor
	- Lý do: service phụ thuộc các `Repository` interface (OK), nhưng nếu trong code service trực tiếp khởi tạo các helper, refactor để inject abstraction.
- `frontend/src/services/api.js` — OK (central abstraction)
	- Lý do: giữ HTTP logic tập trung; components nên dùng api wrapper.
- `frontend/src/context/AuthContext.jsx` — OK
	- Lý do: cung cấp abstraction `useAuth()` cho components.

---

Nếu muốn, tôi có thể:
- (A) Tạo `DIP-audit.md` chi tiết hơn liệt kê mọi file cùng đánh giá OK/needs refactor; hoặc
- (B) Tạo ví dụ PR mẫu: tách 1 component đang gọi `fetch` trực tiếp thành dùng `api.js` abstraction.

Chọn A hoặc B để tôi tiếp tục.

