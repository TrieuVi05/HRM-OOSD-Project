# OCP — Open/Closed Principle (Nguyên tắc Mở/Đóng)

Mục tiêu: viết mã sao cho **mở để mở rộng, đóng để sửa đổi** — thêm hành vi mới bằng cách mở rộng (thêm class/strategy/plugin), không sửa mã đã hoạt động.

## 1. Khái niệm ngắn gọn
- OCP nghĩa là khi cần thêm chức năng mới, chúng ta nên thêm mã mới (mở rộng) thay vì chỉnh sửa code hiện tại (sửa đổi). Điều này giảm rủi ro gây lỗi và giúp bảo trì.

## 2. Áp dụng OCP trong project này (tóm tắt)
- **Service interfaces + implementations**: nhiều service trong `backend/src/main/java/com/hrm/HRM/service/` có interface và `*ServiceImpl` concrete — cho phép thêm implementation hoặc mở rộng behaviour mà không sửa interface callers.
- **Repository interfaces**: `extends JpaRepository` — Spring Data cho phép mở rộng bằng cách thêm custom interface/implementation mà không sửa code framework.
- **Frontend `api.js`**: wrapper trung tâm cho HTTP — có thể mở rộng bằng interceptor/retry/caching mà không thay đổi components gọi API.
- **ProtectedRoute & AuthContext**: component guard và context expose interface; có thể mở rộng rules/strategies (ví dụ thêm role checks/feature flags) mà không sửa các component dùng chúng.

## 3. Ví dụ cụ thể trong repo
- `LeaveRequestService` (interface) + `LeaveRequestServiceImpl` (implementation): thêm policy/phần xử lý mới nên dùng strategy pattern thay vì sửa trực tiếp `LeaveRequestServiceImpl`.
- Repositories (`UserRepository`, `LeaveRequestRepository`, ...): thêm query tuỳ chỉnh bằng `CustomRepository` interface + implementation.
- `frontend/src/services/api.js`: thêm interceptor logging/refresh-token/caching mà không cần sửa từng page/component.

## 4. Vấn đề thường gặp khi OCP không được tôn trọng
- Sửa trực tiếp `*ServiceImpl` mỗi khi có rule/feature mới → code phình to, dễ gây bug cho chức năng hiện có.
- Mapping/validation đặt rải rác trong service → khi thêm variant request/response phải sửa nhiều chỗ.

## 5. Hướng tiếp cận để tuân thủ OCP (gợi ý thực tế)
1. Strategy / Handler pattern:
   - Khi có nhiều loại policy (ví dụ phê duyệt đơn nghỉ có nhiều rule theo role hoặc loại nghỉ), tạo `ApprovalStrategy` interface và nhiều `ApprovalStrategy` concrete; `LeaveApprovalService` chỉ chọn strategy phù hợp. Thêm chiến lược mới không sửa service core.
2. Abstract base + extension:
   - Nếu nhiều services có hành vi CRUD chung, dùng `AbstractCrudService<T>` để chứa logic chung và cho phép subclass mở rộng hành vi đặc thù.
3. Mapper/Validator tách riêng:
   - Tách mapper và validator ra khỏi service để dễ bổ sung format/validation mới mà không thay đổi service logic.
4. Event/Plugin points:
   - Thay vì gọi các handler trực tiếp trong service, publish event (ví dụ `LeaveApprovedEvent`) và subscribe handler mới. Thêm handler mới không sửa service.
5. Frontend interceptors:
   - Thêm features (error handling, retry, telemetry) vào `api.js` bằng interceptor chain.

## 6. Kiểm tra nhanh OCP khi review code
- Code bổ sung tính năng mới có sửa code hiện có không? Nếu có, cân nhắc tách chiến lược hoặc plugin.
- Có interface hoặc điểm mở extension không? Nếu chưa, tạo interface/abstraction.

## 7. Hành động đề nghị cụ thể (ưu tiên)
1. Đối với quy trình approval: tạo `ApprovalStrategy` + registry; thay vì sửa `LeaveRequestServiceImpl` cho mỗi policy.
2. Di chuyển mapping sang `*Mapper` và validation sang `*Validator` để service và controller không phải sửa khi thêm variant.
3. Document extension points (ví dụ: nơi publish event, nơi đăng ký strategy) để team biết chỗ mở rộng an toàn.

---

File này tóm tắt cách OCP được áp dụng trong repo và các bước cụ thể để cải thiện tuân thủ OCP. Muốn tôi tạo thêm `OCP-audit.md` liệt kê file cụ thể và đánh giá (OK / needs refactor)?

## Audit: Liệt kê file chính và đánh giá OCP/SRP (ngắn)
Danh sách dưới đây là các file/điểm quan trọng đã rà soát nhanh, kèm đánh giá ngắn và khuyến nghị.

- `backend/src/main/java/com/hrm/HRM/repository/UserRepository.java` — OK
   - Lý do: interface `extends JpaRepository`, trách nhiệm rõ (persistence). Khuyến nghị: nếu cần custom query lớn, thêm `CustomRepository`.

- `backend/src/main/java/com/hrm/HRM/repository/LeaveRequestRepository.java` — OK
   - Lý do: repository chuẩn; đảm bảo SRP (persistence). Nếu có nhiều query phức tạp, tách custom impl.

- `backend/src/main/java/com/hrm/HRM/service/LeaveRequestServiceImpl.java` — needs refactor (moderate)
   - Lý do: chứa business + mapping (`mapToResponse`) + approval flows. Khuyến nghị: tách `LeaveRequestMapper` và tách phần approval vào `ApprovalStrategy` để tuân SRP và OCP.

- `backend/src/main/java/com/hrm/HRM/controller/LeaveRequestController.java` — OK → monitor
   - Lý do: nếu controller chỉ mapping → OK. Nếu thấy nhiều điều kiện/branch, di chuyển logic vào service.

- `backend/src/main/java/com/hrm/HRM/dto/` (thư mục DTOs) — OK
   - Lý do: DTOs tách rõ contract; giữ POJO/record, không đặt logic.

- `backend/src/main/java/com/hrm/HRM/service/*Service` (interfaces) — OK
   - Lý do: interface + impl giúp OCP (thêm impl mới nếu cần) — khuyến nghị: giữ interface hẹp, tránh ném quá nhiều method chung.

- `frontend/src/services/api.js` — OK (good candidate for OCP)
   - Lý do: trung tâm cho HTTP; có thể mở rộng bằng interceptor. Khuyến nghị: document interceptor extension points và thêm retry/refresh token interceptor nếu chưa có.

- `frontend/src/context/AuthContext.jsx` — OK (SRP)
   - Lý do: quản lý auth state; nếu logic grow, tách hook/logic refresh token ra module riêng.

- `frontend/src/components/common/ProtectedRoute.jsx` — OK → small tweak
   - Lý do: route guard đúng trách nhiệm. Khuyến nghị: giữ role-checking strategy riêng nếu thêm nhiều rules.

- `frontend/src/pages/shared/LeavesPage.jsx` — needs refactor (light)
   - Lý do: page gọi `api` và hiển thị; nếu chứa nhiều mapping/formatting/permission logic thì tách helper/selector.

- `backend/src/main/java/com/hrm/HRM/exception/BadRequestException.java` — OK
   - Lý do: riêng biệt cho lỗi, SRP tốt.

- `backend/src/main/java/com/hrm/HRM/service/AbstractCrudService` (nếu có) — suggest create
   - Lý do: nếu nhiều service lặp logic CRUD, tạo `AbstractCrudService<T>` để tuân OCP và tránh sửa nhiều nơi khi thay đổi behavior chung.

---

Gợi ý thực hiện nhanh (practical):
1. Tạo `LeaveRequestMapper` và chuyển các hàm `mapToResponse`/`mapFromRequest` từ `LeaveRequestServiceImpl` sang đó.
2. Thiết kế `ApprovalStrategy` interface + `ApprovalStrategyRegistry`; refactor `LeaveRequestServiceImpl` để chọn strategy thay vì chứa nhiều branch.
3. Thêm comment/documentation ở `frontend/src/services/api.js` nêu cách đăng ký interceptor để team mở rộng mà không sửa callers.

Nếu bạn OK, tôi sẽ tạo file `OCP-audit.md` và `SRP-audit.md` chi tiết hơn, liệt kê mỗi file trong repo (backend + frontend) với đánh giá ngắn và đề xuất cụ thể. Xác nhận để tôi tạo tiếp.
