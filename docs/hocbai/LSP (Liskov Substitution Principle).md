# LSP — Liskov Substitution Principle (Nguyên tắc Thay thế Liskov)

Mục tiêu: đảm bảo rằng mọi subtype (lớp con / implementation) có thể thay thế superclass hoặc interface mà không làm thay đổi tính đúng đắn của chương trình.

## 1. Khái niệm ngắn gọn
- LSP phát biểu rằng nếu S là subtype của T thì mọi chương trình sử dụng T đều có thể sử dụng S mà không biết sự khác biệt. Về thực tiễn: subclass/implementation không được phá vỡ hợp đồng (contract) của base type.

## 2. Tại sao LSP quan trọng
- Giúp OOP an toàn: khi code dựa trên interface/abstraction, chúng ta có thể thay đổi implementation mà không cần sửa callers.
- Giảm bug do subclass thay đổi behavior không tương thích.

## 3. Áp dụng LSP trong project này (tóm tắt)
- **Repository interfaces (Spring Data)**: các interface trong `backend/src/main/java/com/hrm/HRM/repository/` (ví dụ `UserRepository`, `LeaveRequestRepository`) `extends JpaRepository` — implementation do Spring cung cấp; thay thế implementation không phá vỡ callers.
- **Service interfaces + implementations**: pattern `SomeService` (interface) + `SomeServiceImpl` (implementation) cho phép thay implementation mà không ảnh hưởng controller/consumers nếu implementation tôn trọng contract (phương thức, exceptions, side-effects).
- **Exceptions / Contracts**: các API (controller/service) cần giữ contract về: input validation, output shape (DTO), exceptions (loại ngoại lệ đã document) — implementation mới không được thay đổi contract một cách bất ngờ.
- **Frontend (React)**: `AuthContext` cung cấp API (hook `useAuth()`); nếu viết provider thay thế, phải giữ API contract (props/values/behavior) để components không phá vỡ.

## 4. Ví dụ cụ thể trong repo
- `LeaveRequestService` (interface) và `LeaveRequestServiceImpl` (implementation): các consumers (controller, tests) dựa trên `LeaveRequestService`. Nếu thay implementation (ví dụ mock, alternate impl) phải đảm bảo trả kết quả tương tự theo spec.
- `api.js` (frontend) là API boundary — nếu thay implementation (ví dụ đổi fetch sang axios wrapper), cần giữ các hàm public (`getLeaves`, `createLeave`, ...) cùng contract.

## 5. Dấu hiệu vi phạm LSP (what to look for)
- Subclass/implementation thay đổi semantics: ví dụ method `approve()` ở subclass trả trạng thái khác, hay thay đổi side-effect (gọi thêm external service) mà callers không mong đợi.
- Thay đổi loại ngoại lệ (throws) không tương thích: nếu interface/contract nói không ném checked exception nhưng implementation bây giờ ném checked/unchecked khác mà callers không xử lý.
- Trả `null` khi base contract phải trả non-null (hoặc ngược lại).
- Giảm nghiệm vụ tiền điều kiện (precondition) hoặc tăng nghiệm vụ hậu điều kiện (postcondition) so với interface. (Ví dụ: base cho phép null input nhưng impl mới không, hoặc base bảo luôn trả list rỗng khi không có dữ liệu nhưng impl trả null.)

## 6. Kiểm tra LSP trong project — checklist
- Interface method signatures có thay đổi không? (Không) 
- Implementation có trả kiểu/shape khác so với DTO contract không? 
- Implementation có ném exception mới không document không? 
- Implementation có thay đổi semantic (side-effects, trạng thái) khiến callers bị lỗi không? 
- Frontend component/provider giữ contract props/values/hook API không? 

## 7. Những nơi cần rà soát trong repo (gợi ý file)
- `backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java` — rà soát: có giữ contract (response DTO shape, exceptions) không; nếu tách strategy, đảm bảo strategy implementations tuân contract.
- `backend/src/main/java/com/hrm/HRM/service/*ServiceImpl.java` — rà soát tương tự cho các service quan trọng (Payroll, Attendance, User).
- `backend/src/main/java/com/hrm/HRM/repository/*Repository.java` — đảm bảo custom implementation không phá vỡ contract (trả types, xử lý empty result, null safety).
- `frontend/src/services/api.js` — thay implementation phải giữ API functions và error/response shape.
- `frontend/src/context/AuthContext.jsx` — provider thay thế phải giữ `value` shape (`token`, `user`, `role`, `login`, `logout`) và side-effects (login sets token) giống cũ.

## 8. Hành động đề nghị / refactor để đảm bảo LSP
1. Document contracts (trong javadoc hoặc README): cho mỗi service/interface, nêu tiền điều kiện (preconditions), hậu điều kiện (postconditions) và exceptions đã định nghĩa.
2. Tách concerns: giữ mapping/formatting vào `Mapper` để implementation không vô tình đổi shape trả về.
3. Thêm test thay thế (substitution tests): viết unit/integration tests dùng interface type, có thể swap implementation (mock hoặc alternative impl) để đảm bảo behavior không đổi.
4. Avoid widening exceptions: nếu interface không expect certain checked exception, tránh ném chúng từ impl; document unchecked exceptions.
5. Null-safety: document và tiêu chuẩn hoá trả `Optional` hoặc trả collection rỗng thay vì `null`.

## 9. Ví dụ kiểm thử LSP (quick)
- Tạo test base dùng interface `LeaveRequestService`:
  - gọi `getAll()` → assert trả list (không null) và shape DTO hợp lệ.
  - swap `LeaveRequestServiceImpl` với test double (mock impl) — test vẫn pass.

## 10. Kết luận & bước tiếp
- LSP là nguyên tắc cân bằng: nó không chỉ về signature mà quan trọng là về semantics và contract. Trong repo này, nhiều abstraction (repositories, services, api wrapper) đã đặt nền tảng tốt — cần chú trọng document contract, tách mapper/validator, và bổ sung substitution tests.

Bạn muốn tôi:  a) thêm checklist LSP vào quy trình review (PR template) hoặc b) tạo file `LSP-audit.md` liệt kê từng file + đánh giá ngắn (OK / needs refactor)? Chọn 1 để tôi thực hiện tiếp.
