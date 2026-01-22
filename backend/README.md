# Backend

## 1. Cấu trúc thư mục

```
backend/
├─ src/main/java/com/hrm/backend/
│  ├─ controller/   # REST API
│  ├─ service/      # Business logic
│  ├─ repository/   # JPA repositories
│  ├─ entity/       # Entity models
│  ├─ dto/          # Request/Response DTOs
│  └─ security/     # Security config
└─ src/main/resources/
   └─ application.properties
```

## 2. Chạy backend

- Yêu cầu: Java 17+, Maven 3.8+
- Lệnh chạy:
  - `mvn clean install`
  - `mvn spring-boot:run`

Mặc định chạy tại `http://localhost:8080`.

## 3. TODO các thành phần cần code

1. Entity: attendance, payroll, leave, recruitment, candidate, interview, performance.
2. Repository cho các entity mới.
3. Service + ServiceImpl cho các nghiệp vụ còn thiếu.
4. Controller REST theo danh sách API trong README gốc.
5. Validation & exception handling thống nhất.
6. Bảo mật: JWT, role-based access.

## 4. Ghi chú

- Cấu hình DB nằm ở `src/main/resources/application.properties`.
- Script SQL ở `database/scripted/database.sql`.
