# HRM Package

Thư mục này chứa toàn bộ mã nguồn backend cho hệ thống HRM.

## Cấu trúc chính

- `controller/`: REST controllers (API endpoints)
- `service/`: Business logic
- `repository/`: JPA repositories
- `entity/`: JPA entities
- `dto/`: Request/Response DTOs
- `security/`: JWT, Security config
- `exception/`: Exception handling

## Ghi chú

- Các endpoint nghiệp vụ chính: chấm công, nghỉ phép, lương, tuyển dụng.
- Phân quyền theo role được cấu hình bằng `@PreAuthorize`.
