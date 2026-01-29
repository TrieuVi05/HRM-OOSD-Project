# ISP — Interface Segregation Principle (Nguyên tắc Phân tách Interface)

Mục tiêu: tránh bắt clients phải phụ thuộc vào interface họ không sử dụng — tách interface lớn thành nhiều interface nhỏ, mỗi interface chỉ chứa những phương thức cần cho một tập clients cụ thể.

## 1. Khái niệm ngắn gọn
- ISP bảo rằng các interface nên nhỏ và tập trung; clients chỉ nên thấy những phương thức họ cần. Điều này giảm coupling và làm cho implementations dễ thay thế, test và mở rộng.

## 2. Tại sao ISP quan trọng trong project này
- Khi một `Service` hoặc `Repository` chứa nhiều phương thức không liên quan, các consumer sẽ bị buộc phụ thuộc vào API rộng, khó mock và dễ bị ảnh hưởng khi thay đổi.

## 3. Áp dụng ISP trong repo (tóm tắt)
- **Repository interfaces** trong `backend/src/main/java/com/hrm/HRM/repository/` hiện chia theo entity (ví dụ `UserRepository`, `LeaveRequestRepository`). Đây là một ứng dụng của ISP: mỗi repository chỉ chứa các phương thức liên quan đến entity đó.
- **Service interfaces**: nếu interface chứa quá nhiều method (CRUD + business-specific), cân nhắc tách thành `ReadService`, `WriteService`, `ApprovalService`... để clients chỉ phụ thuộc vào contract họ cần.
- **Frontend**: tránh tạo một object `api` quá lớn với mọi phương thức; nhóm các API theo domain (`authApi`, `leaveApi`, `payrollApi`) để components chỉ import phần cần thiết.

## 4. Ví dụ cụ thể & nơi nên rà soát
- `LeaveRequestService` (nếu interface chứa create/read/approve/delete + nhiều helper) → tách thành `LeaveQueryService` (đọc), `LeaveCommandService` (tạo/cập nhật/xóa), `LeaveApprovalService` (phê duyệt).
- `UserRepository` hiện OK vì scoped theo entity; nếu thấy repository chứa nhiều tiện ích cross-entity, tách ra.
- `frontend/src/services/api.js`: nếu `api` export toàn bộ hàm, xem xét export theo module/domain để components không import cả đống hàm không dùng.

## 5. Dấu hiệu vi phạm ISP (what to look for)
- Interface có nhiều phương thức mà một client chỉ dùng 1–2 phương thức.
- Tests phải mock nhiều phương thức của một interface trong khi test chỉ quan tâm vài method.
- Implementation class phải implement nhiều method unused cho một client cụ thể.

## 6. Kiểm tra/Refactor checklist
1. Rà soát service interfaces: nếu >6 phương thức tổng quát, cân nhắc phân tách theo responsibility.
2. Rà soát tests: nếu tests mock và stub nhiều method không liên quan → tách interface.
3. Frontend imports: kiểm tra `import { api } from "../services/api"` trong component; nếu component chỉ dùng `api.getLeaves`, thay đổi để import `leaveApi.getLeaves`.

## 7. Hành động đề nghị (ưu tiên)
1. Tách `LeaveRequestService` nếu nó chứa nhiều loại hành vi (read/command/approval).
2. Chia `api.js` thành domain modules (`frontend/src/services/leaveApi.js`, `authApi.js`, `payrollApi.js`) và document contract mỗi module.
3. Khi tạo interface mới, giữ nó hẹp (không nhiều method), viết tests substitution dễ dàng.

## 8. Kiểm tra nhanh file/điểm liên quan
- `backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java` — rà soát: nếu class implement interface có nhiều method, tách interface/impl.
- `frontend/src/services/api.js` — tách domain APIs nếu hiện tại export một object lớn.
- `frontend/src/components/*` — update imports để chỉ lấy module cần thiết sau khi tách.

---

Ghi chú: Tôi đã thêm checklist refactor ngắn; nếu bạn muốn, tôi có thể tự động tạo `ISP-audit.md` liệt kê files cần tách và PR patch mẫu (ví dụ tạo `leaveApi.js` và cập nhật một component). Muốn tôi tạo PR mẫu không?
