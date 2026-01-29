# Kế thừa (Inheritance) trong project HRM

Tài liệu này tóm tắt mọi chỗ trong project nơi dùng khái niệm kế thừa (inheritance) — cả ở backend (Java / Spring) và frontend (React). Bao gồm ví dụ, giải thích vì sao dùng kế thừa ở từng chỗ, và liên kết tới các file tham chiếu.

**Khái niệm ngắn gọn**: Kế thừa (inheritance) là cơ chế OOP cho phép một lớp con thừa hưởng thuộc tính và phương thức của lớp cha (sử dụng `extends` trong Java). Ở Java còn có thừa kế giao diện bằng `implements` và thừa kế giao diện giữa các interface (interface extends interface). Trong project này ta thấy cả "class extends class" và "interface extends interface".

**Tại sao dùng ở project này**
- Tái sử dụng hành vi/framework: ví dụ `JwtAuthenticationFilter` kế thừa `OncePerRequestFilter` để tận dụng contract của Spring Security filter chain.
- Kế thừa interface giúp tận dụng sẵn API của Spring Data JPA (ví dụ repository extends `JpaRepository`).
- Các exception tuỳ biến kế thừa `RuntimeException` để dễ ném/handle trong toàn ứng dụng.

**Ví dụ cụ thể trong code (backend)**
- `JwtAuthenticationFilter` extends `OncePerRequestFilter`: bộ lọc JWT implement phương thức `doFilterInternal(...)` theo contract của Spring Security. Xem mã nguồn tại: [backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java](backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java#L1-L200)

- Exception tuỳ biến extends `RuntimeException`:
	- `BadRequestException` — [backend/src/main/java/com/hrm/HRM/exception/BadRequestException.java](backend/src/main/java/com/hrm/HRM/exception/BadRequestException.java#L1-L50)
	- `ResourceNotFoundException` — [backend/src/main/java/com/hrm/HRM/exception/ResourceNotFoundException.java](backend/src/main/java/com/hrm/HRM/exception/ResourceNotFoundException.java#L1-L50)

- Repository interfaces extend Spring Data interface `JpaRepository` (interface inheritance): ví dụ `UserRepository` extends `JpaRepository<User, Long>` — xem: [backend/src/main/java/com/hrm/HRM/repository/UserRepository.java](backend/src/main/java/com/hrm/HRM/repository/UserRepository.java#L1-L50)

**Giải thích ngắn cho từng ví dụ**
- `JwtAuthenticationFilter extends OncePerRequestFilter`:
	- Lý do: Spring Security cung cấp vòng đời filter; kế thừa `OncePerRequestFilter` giúp bộ lọc của ta chạy đúng một lần mỗi request và bắt buộc phải override `doFilterInternal`.
	- Hệ quả: ta chỉ cần viết logic trích token, validate và set `SecurityContext` — phần còn lại do framework xử lý.

- `BadRequestException` / `ResourceNotFoundException` extends `RuntimeException`:
	- Lý do: dễ ném và xử lý chung ở layer controller/exception handler; không cần bắt checked exception.

- `UserRepository extends JpaRepository` (interface inheritance):
	- Lý do: kế thừa API CRUD, paging, sorting sẵn có của Spring Data JPA, giảm boilerplate.

**Frontend (React)**
- Ở frontend source code (React + Vite) hầu hết là functional components và hooks (composition), không dựa nhiều vào kế thừa class-based. Do đó project ưu tiên composition hơn inheritance ở UI layer.
- Trong bản build (thư mục `frontend/dist`) có các class do bundler/React Router tạo (ví dụ `class ... extends Component`) nhưng đây là kết quả build/compile; mã nguồn chính của bạn dùng function component.

**Danh sách file đáng chú ý (tóm tắt)**
- `JwtAuthenticationFilter` — [backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java](backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java#L1-L200)
- `BadRequestException` — [backend/src/main/java/com/hrm/HRM/exception/BadRequestException.java](backend/src/main/java/com/hrm/HRM/exception/BadRequestException.java#L1-L50)
- `ResourceNotFoundException` — [backend/src/main/java/com/hrm/HRM/exception/ResourceNotFoundException.java](backend/src/main/java/com/hrm/HRM/exception/ResourceNotFoundException.java#L1-L50)
- `UserRepository` — [backend/src/main/java/com/hrm/HRM/repository/UserRepository.java](backend/src/main/java/com/hrm/HRM/repository/UserRepository.java#L1-L50)
- Các repository khác đều `extends JpaRepository` (ví dụ `LeaveRequestRepository`, `AttendanceRepository`, ... trong `backend/src/main/java/com/hrm/HRM/repository/`)

**Best practices & Gợi ý cho contributor**
- Dùng kế thừa khi bạn muốn tuân theo một contract có sẵn (ví dụ filter, servlet, hay Spring Data interfaces). Với logic nghiệp vụ, ưu tiên composition (inject service, tái sử dụng helper) thay vì tạo cây kế thừa phức tạp.
- Tránh dùng kế thừa để chia sẻ trạng thái mutable; thay vào đó dùng thành phần (component) hoặc service.
- Khi tạo exception tuỳ chỉnh, kế thừa `RuntimeException` nếu bạn muốn simple unchecked flow; thêm mã lỗi/field nếu cần cho handler.

Nếu bạn muốn, tôi có thể:
- Liệt kê mọi file `extends`/`implements` toàn bộ repo và đính kèm đoạn code ngắn từ mỗi file.
- Thêm sơ đồ đơn giản (text) biểu diễn mối quan hệ kế thừa chính.

-- Kết thúc

# Kế thừa (Inheritance) — tài liệu hướng dẫn (tập trung vào inheritance)

Tài liệu này thay thế phần trước: cấu trúc và nội dung chỉ về **kế thừa** (inheritance). Mục tiêu: mô tả nơi và cách dùng inheritance trong project, mẫu thực hành, và ví dụ cụ thể.

Tóm tắt: Trong Java/Spring, inheritance xuất hiện theo các dạng chính:
- Class extends class (ví dụ `OncePerRequestFilter` → `JwtAuthenticationFilter`).
- Interface extends interface và class implements interface (ví dụ `Repository` interfaces extends `JpaRepository`).

1) Entities + BaseEntity
- Pattern phổ biến: tạo `BaseEntity` chứa các trường chung (`id`, `createdAt`, `updatedAt`) và annoted `@MappedSuperclass`. Các entity cụ thể `extends BaseEntity` để tái sử dụng mapping và lifecycle logic.
- Khi áp dụng: đặt các field chung là `private/protected` và cung cấp getter/setter; lifecycle hooks (`@PrePersist`, `@PreUpdate`) có thể đặt trong `BaseEntity` để mọi entity hưởng lợi.
- Lợi ích: giảm trùng lặp, nhất quán timestamp/ID xử lý.

Ví dụ minimal (gợi ý):
```java
@MappedSuperclass
public abstract class BaseEntity {
	@Id @GeneratedValue
	private Long id;
	@Column(name="created_at")
	private Instant createdAt;
	@PrePersist
	protected void onCreate(){ createdAt = Instant.now(); }
	public Long getId(){ return id; }
}

@Entity
public class LeaveRequest extends BaseEntity { /* fields riêng */ }
```

2) DTOs và Base DTO
- Khi nhiều DTO chia sẻ fields, dùng `BaseRequest`/`BaseResponse` để tránh lặp. DTOs không chứa logic trạng thái, chỉ dữ liệu.

Ví dụ:
```java
public class BaseRequest { private Long requesterId; /* getters/setters */ }
public class LeaveRequestCreate extends BaseRequest { private LocalDate from; private LocalDate to; }
```

3) Services — abstract base service / extension
- Nếu nhiều service chia sẻ behaviour (common validation, mapping helpers), tạo `AbstractService<T, ID>` (abstract class) chứa helper methods; concrete services `extends AbstractService` và implement business-specific logic.
- Ví dụ: `AbstractCrudService<T, ID>` có các method dùng chung (`findByIdOrThrow`, pagination helpers) và gọi `repository` tương ứng.

4) Repositories (interface inheritance)
- Spring Data: các repository interface `extends JpaRepository<Entity, Long>` — đây là inheritance ở mức interface, giúp nhận sẵn CRUD API.
- Khi cần mở rộng, khai báo `public interface CustomRepo extends JpaRepository<X, Long>, CustomRepoCustom {}` và cài logic tuỳ chỉnh trong implementation class.

5) Framework classes / Filters / Exceptions
- Thực tế: `JwtAuthenticationFilter` extends `OncePerRequestFilter` — đây là ví dụ kế thừa để tuân theo contract của Spring Security filter chain (override `doFilterInternal`).
- Custom exceptions thường `extends RuntimeException` để có unchecked flow.

6) Frontend (React) — lưu ý
- Frontend mã nguồn chính dùng function components + hooks (composition) — inheritance ít dùng. Tuy nhiên build output có class-based artifacts do bundler.
- Nếu bắt buộc chia sẻ behaviour giữa components, ưu tiên custom hooks (composition) hoặc higher-order components; tránh class inheritance trong React functional code.

7) Mapping / Naming (JSON ↔ Java)
- Inheritance tác động tới mapping khi base class chứa fields cần serialize/deserialize. Jackson tự hỗ trợ inheritance nếu cần (`@JsonTypeInfo`), nhưng tốt nhất tách rõ DTO vs Entity để tránh lộ schema nội bộ.

8) Best practices cụ thể cho project
- Dùng `BaseEntity` khi >1 entity chia sẻ fields/behaviour; giữ `BaseEntity` đơn giản (timestamps, id, audit fields).
- Dùng abstract service classes cho logic tái sử dụng giữa services.
- Dùng interface inheritance cho repositories (Spring Data) và tránh đặt business logic trong repository.
- Tách DTO khỏi Entity; mapping trong service layer (hoặc MapStruct) để giảm coupling.

9) Quick links (file ví dụ trong repo)
- `backend/src/main/java/com/hrm/HRM/security/JwtAuthenticationFilter.java` — extends `OncePerRequestFilter`
- `backend/src/main/java/com/hrm/HRM/entity/User.java` — entity ví dụ (cân nhắc `BaseEntity`)
- `backend/src/main/java/com/hrm/HRM/repository/UserRepository.java` — extends `JpaRepository`

10) Nếu bạn muốn tôi tiếp tục
- Liệt kê tất cả file có `extends` / `implements` kèm đoạn mã (tự động trích).  (tùy chọn: tôi sẽ tạo `BaseEntity` + ví dụ mapping service và tests nếu bạn muốn) 

-- Kết thúc (inheritance-focused)

---

**Hướng dẫn: kế thừa (Inheritance) — theo cấu trúc giống `encapsulation-donggoi.md`**

1) Entities (ví dụ): `LeaveRequest`, `Employee`, `Payroll`
- Thiết kế: giữ trạng thái private bằng các field `private` + cung cấp `public` getters/setters (encapsulation) và, khi cần, lifecycle hooks như `@PrePersist` / `@PreUpdate` để quản lý trạng thái nội bộ (ví dụ set `createdAt`, `status` mặc định,...).
- Vai trò của inheritance: không bắt buộc phải có cây kế thừa giữa entities; thay vào đó entity có thể "kế thừa" behaviour từ một base class chung nếu có nhiều entity chia sẻ trường/logic (ví dụ `BaseEntity` chứa `id`, `createdAt`, `updatedAt`). Nếu bạn muốn áp dụng, tạo `BaseEntity` và cho các entity `extends BaseEntity`.
- Ví dụ files liên quan: `backend/src/main/java/com/hrm/HRM/entity/User.java` (mẫu entity), khả năng thêm `backend/src/main/java/com/hrm/HRM/entity/BaseEntity.java` nếu cần.

2) DTOs (ví dụ): `LeaveRequestRequest`, `PayrollRequest`
- Thiết kế: tách DTO cho input/output khỏi Entity; DTOs thường là POJO/record, không chứa logic trạng thái — chỉ dùng để mapping giữa request/response và entity.
- Kết hợp với inheritance: bạn có thể dùng một DTO base (ví dụ `BaseRequest`) nếu nhiều DTO chia sẻ fields chung.

3) Services / Repositories
- Nguyên tắc: che giấu chi tiết persistence bằng service layer; controllers gọi `service` thay vì truy xuất repository trực tiếp. Điều này "encapsulate" persistence và cho phép tái sử dụng / unit-test.
- Inheritance: repository interfaces `extends JpaRepository<..., ...>` (interface inheritance) để thừa hưởng CRUD API của Spring Data.
- Ví dụ file: `backend/src/main/java/com/hrm/HRM/repository/UserRepository.java` và các repository tương tự.

4) API wrapper (frontend)
- Ở frontend, `frontend/src/services/api.js` đóng gói logic HTTP: headers (Authorization), xử lý lỗi chung, base URL, và retry/cancel nếu cần. Đây là một ví dụ của việc che giấu chi tiết mạng khỏi components.
- Nếu cần chia sẻ behaviour giữa nhiều wrappers, bạn có thể làm một lớp/obj base và cho các wrapper cụ thể kế thừa/compose từ đó.

5) Context (Auth)
- `frontend/src/context/AuthContext.jsx` encapsulates auth state (token, user, role) và expose helpers (`login()`, `logout()`, `getAuthHeader()`) — đây là pattern composition hơn là classical inheritance, nhưng có thể kết hợp: nếu có nhiều context share behaviour, tạo base hook/context factory.

6) Components / Hooks
- Component-level encapsulation: pages như `frontend/src/pages/employee/EmployeeLeavesPage.jsx` hoặc `frontend/src/pages/employee/EmployeeAttendancePage.jsx` giữ state cục bộ (form data, filters) và expose chỉ callbacks/props cần thiết cho con component (ví dụ `onSubmit`, `onFilterChange`).
- Inheritance ở UI: project dùng function components + hooks (composition). Nếu muốn chia sẻ behaviour, ưu tiên custom hooks (`useSomething`) thay vì class inheritance.

7) Mapping / Naming (JSON ↔ Java)
- Chuẩn hóa mapping để tránh lộ chi tiết DB/schema lên client: dùng Jackson annotations (`@JsonProperty`, `@JsonIgnore`), hoặc cấu hình `ObjectMapper` để dùng naming strategy (snake_case ↔ camelCase) khi cần.
- Đây là phần của encapsulation: entity nội bộ khác với contract API (DTO), vì vậy mapping tách biệt là bắt buộc.

8) Gợi ý triển khai cụ thể (checklist)
- Nếu cần một `BaseEntity` để tái sử dụng `id/createdAt/updatedAt`: tạo `BaseEntity` với các trường protected/private và `@MappedSuperclass`, rồi cho entity cụ thể `extends BaseEntity`.
- Tạo DTOs tách riêng cho request/response, và mapping trong service layer (manual hoặc dùng MapStruct).
- Giữ `Repository` interfaces nhỏ, expose repository cho service; service thực hiện transaction (`@Transactional`) nếu cần.
- Frontend: giữ `api.js` là duy nhất nơi cấu hình headers/refresh token; `AuthContext` dùng `api.js` để gọi backend.

9) Liên kết file tham khảo (quick links)
- `backend/src/main/java/com/hrm/HRM/entity/User.java` — ví dụ entity
- `backend/src/main/java/com/hrm/HRM/repository/UserRepository.java` — repository interface
- `frontend/src/services/api.js` — HTTP wrapper
- `frontend/src/context/AuthContext.jsx` — auth context
- `frontend/src/pages/employee/EmployeeLeavesPage.jsx` — component example