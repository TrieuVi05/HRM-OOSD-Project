Encapsulation trong dự án HRM-OOSD
===============================================

1) Khái niệm ngắn gọn
- Encapsulation (đóng gói / bao gói) là nguyên tắc OOP/thiết kế phần mềm nhằm ẩn các chi tiết hiện thực bên trong một module/class và chỉ phơi ra một giao diện rõ ràng để tương tác (getter/setter, phương thức public, API...).
- Mục tiêu: bảo vệ trạng thái nội bộ, giảm phụ thuộc (coupling), tăng tính bảo trì và khả năng tái sử dụng.

2) Lợi ích
- Ngăn trạng thái bị thao tác trực tiếp từ bên ngoài.
- Dễ dàng thay đổi hiện thực bên trong mà không ảnh hưởng phần còn lại của hệ thống.
- Tập trung kiểm soát validation/logic tại một chỗ (ví dụ: kiểm tra dữ liệu trước khi gán vào field).

3) Những nơi áp dụng Encapsulation trong project này (ví dụ cụ thể)

- Backend (Java / Spring Boot)
	- Entities + DTOs:
		- `LeaveRequest` (file: backend/src/main/java/com/hrm/HRM/entity/LeaveRequest.java) định nghĩa các field là `private` và sử dụng Lombok `@Getter @Setter` để cung cấp accessor thay vì cho phép truy xuất trực tiếp vào field. Đây là biểu hiện cơ bản của encapsulation: trạng thái nội bộ (createdAt, approvedAt, ...) được đóng gói trong entity.
		- DTO `LeaveRequestRequest` (backend/src/main/java/com/hrm/HRM/dto/LeaveRequestRequest.java) tách lớp request (dữ liệu đầu vào) khỏi entity, giúp kiểm soát dữ liệu vào trước khi chuyển vào entity (anti-corruption, mapping layer).
	- @PrePersist / lifecycle hooks:
		- Việc thêm `@PrePersist` vào entity (đã được áp dụng trong `LeaveRequest`) cho phép entity tự quản lý `createdAt` khi được persist — đây là một dạng cân bằng giữa encapsulation và tự quản lý trạng thái nội bộ (không bắt frontend phải cung cấp createdAt).
	- Service/Repository:
		- Các service (nếu có trong codebase) thường ẩn chi tiết truy vấn/transaction và cung cấp API cho controller; controller không tương tác trực tiếp với repository chi tiết.

- Frontend (React)
	- Components + Hooks:
		- Các component như `EmployeeDashboard.jsx`, `EmployeeLeavesPage.jsx`, `EmployeeAttendancePage.jsx` đều giữ state cục bộ bằng `useState`/`useMemo`. State này không bị lộ ra ngoài trừ khi component chủ động phơi ra props hoặc gọi API. Đây là encapsulation cấp component.
	- Contexts:
		- `AuthContext.jsx` (frontend/src/context/AuthContext.jsx) đóng vai trò như một API/bao gói cho thông tin xác thực: chứa `token`, `user`, `role` và các helper (login/logout). Các component khác chỉ sử dụng hook `useAuth()` thay vì truy xuất localStorage hay logic xác thực trực tiếp.
	- Services/API wrapper:
		- `frontend/src/services/api.js` đóng gói toàn bộ logic HTTP (fetch, header, error mapping) vào một đối tượng `api`. Các component gọi `api.getLeaves(token)` hay `api.createLeave(token, payload)` thay vì gọi `fetch` trực tiếp. Đây là một implementation quan trọng của encapsulation: tách rời chi tiết giao tiếp HTTP ra 1 layer.

4) Một số ví dụ minh họa từ codebase
- Entity encapsulation (Java + Lombok)
	```java
	@Entity
	public class LeaveRequest {
		@Id
		private Long id;

		@Column(name = "created_at")
		private Instant createdAt;

		@PrePersist
		public void prePersist() {
			if (createdAt == null) createdAt = Instant.now();
		}
	}
	```
	- Ở đây field `createdAt` chỉ có getter/setter qua Lombok; lifecycle hook set giá trị khi persist (không bắt client gửi createdAt).

- API wrapper encapsulation (frontend)
	```js
	// frontend/src/services/api.js
	export const api = {
		getLeaves: (token) => request('/api/leaves', { token }),
		createLeave: (token, payload) => request('/api/leaves', { method: 'POST', token, body: payload }),
		// ...
	}
	```
	- Các component chỉ cần gọi `api.createLeave(...)` mà không cần quan tâm header, lỗi, decode JSON, v.v.

- Component state encapsulation (frontend)
	```jsx
	export default function EmployeeLeavesPage() {
		const [leaves, setLeaves] = useState([]);
		useEffect(() => { api.getLeaves(token).then(setLeaves) }, [token]);
	}
	```
	- `leaves` được giữ trong component; hiển thị và thao tác đều qua API/handler nội bộ.

5) Vấn đề đã gặp (liên quan đến encapsulation vs mapping)
- Trong quá trình phát triển, có lỗi DB `created_at cannot be null` khi frontend gửi payload: nguyên nhân là DTO `LeaveRequestRequest` không có `createdAt` field nên backend mapping không lấy giá trị từ request (vì không mong đợi).
- Giải pháp đúng là: để backend tự set `createdAt` (ví dụ `@PrePersist`) — điều này đã được cập nhật trong entity `LeaveRequest`.

6) Kiến nghị / Best practices cho project này
- Backend:
	- Nếu một trường do DB/Entity quản lý (như timestamps), hãy để entity tự tạo (dùng `@PrePersist`, `@CreationTimestamp` nếu dùng Hibernate, hoặc default value ở DB). Không bắt client gửi giá trị này.
	- Sử dụng DTO cho input/output: không expose entity trực tiếp ra controller để tránh lộ chi tiết nội bộ.
	- Sử dụng `@JsonProperty` nếu cần mapping tên field khác nhau giữa JSON và Java field.

- Frontend:
	- Tiếp tục sử dụng `services/api.js` như 1 layer duy nhất để gọi backend. Nếu cần thay đổi header/token hay thêm retry logic, chỉ sửa file này.
	- Giữ state cục bộ trong component và lift-up state ra context khi cần chia sẻ giữa nhiều component.

7) Nơi cần cải thiện (gợi ý cụ thể)
- Kiểm tra tất cả entity có trường timestamp (created_at, updated_at) và đảm bảo entity tự set giá trị hoặc DB có default value.
- Chuẩn hóa tên trường JSON <-> Java: nếu project dùng camelCase phía frontend (employeeId) và snake_case DB (employee_id), hãy dùng `@JsonProperty("employee_id")` hoặc cấu hình Jackson PropertyNamingStrategy để tự map.
- Thêm comments nhỏ trong `frontend/src/services/api.js` giải thích contract (một vài endpoint nào cần snake_case vs camelCase) để tránh lỗi mapping.

8) Tóm tắt
- Encapsulation trong project được sử dụng ở nhiều lớp: entity/DTO/service trên backend và components/context/api-wrapper trên frontend. Đó là các điểm then chốt giúp tách biệt trách nhiệm và tăng tính maintainability.

File này đã được ghi với các ví dụ và khuyến nghị; nếu bạn muốn, tôi có thể:
- Thêm link tới từng file (đường dẫn workspace) trong tài liệu này.
- Tạo checklist sửa các entity/DTO để đảm bảo consistency.

Liên kết tới file tham khảo (workspace-relative)
- `LeaveRequest` entity: [backend/src/main/java/com/hrm/HRM/entity/LeaveRequest.java](backend/src/main/java/com/hrm/HRM/entity/LeaveRequest.java)
- `LeaveRequestRequest` DTO: [backend/src/main/java/com/hrm/HRM/dto/LeaveRequestRequest.java](backend/src/main/java/com/hrm/HRM/dto/LeaveRequestRequest.java)
- `AuthContext` (Auth provider): [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)
- API wrapper: [frontend/src/services/api.js](frontend/src/services/api.js)
- Employee leaves page: [frontend/src/pages/employee/EmployeeLeavesPage.jsx](frontend/src/pages/employee/EmployeeLeavesPage.jsx)
- Employee attendance page: [frontend/src/pages/employee/EmployeeAttendancePage.jsx](frontend/src/pages/employee/EmployeeAttendancePage.jsx)
- Employee dashboard: [frontend/src/pages/employee/EmployeeDashboard.jsx](frontend/src/pages/employee/EmployeeDashboard.jsx)
- App routes: [frontend/src/App.jsx](frontend/src/App.jsx)

-- End of document

-- End of document

