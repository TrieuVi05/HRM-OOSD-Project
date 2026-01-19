# 02. Backend

## Yêu cầu

- Java 17+
- Maven 3.8+

## Chạy backend

1. Vào thư mục backend.
2. Build và chạy:
   - `mvn clean install`
   - `mvn spring-boot:run`

Backend chạy tại `http://localhost:8080`.

## Cấu trúc thư mục chi tiết (kèm trạng thái)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── hrm/
│   │   │           └── backend/
│   │   │               ├── BackendApplication.java                # ✅ Có
│   │   │               ├── security/                               # Security & JWT classes
│   │   │               │   └── SecurityConfig.java                 # ✅ Có
│   │   │               ├── controller/                             # REST Controllers
│   │   │               │   ├── DepartmentController.java           # ✅ Có
│   │   │               │   ├── EmployeeController.java             # ✅ Có
│   │   │               │   └── TestController.java                 # ✅ Có
│   │   │               ├── dto/                                    # Data Transfer Objects
│   │   │               │   ├── DepartmentRequest.java              # ✅ Có
│   │   │               │   ├── DepartmentResponse.java             # ✅ Có
│   │   │               │   ├── EmployeeRequest.java                # ✅ Có
│   │   │               │   └── EmployeeResponse.java               # ✅ Có
│   │   │               ├── entity/                                 # JPA Entities
│   │   │               │   ├── Department.java                     # ✅ Có
│   │   │               │   └── Employee.java                       # ✅ Có
│   │   │               ├── repository/                             # JPA Repositories
│   │   │               │   ├── DepartmentRepository.java           # ✅ Có
│   │   │               │   └── EmployeeRepository.java             # ✅ Có
│   │   │               ├── service/                                # Business Logic
│   │   │               │   ├── DepartmentService.java              # ✅ Có
│   │   │               │   ├── DepartmentServiceImpl.java          # ✅ Có
│   │   │               │   ├── EmployeeService.java                # ✅ Có
│   │   │               │   └── EmployeeServiceImpl.java            # ✅ Có
│   │   │               └── exception/                              # TODO: Chưa có
│   │   └── resources/
│   │       └── application.properties                              # ✅ Có
│   └── test/
│       └── java/
│           └── com/
│               └── hrm/
│                   └── backend/
│                       └── BackendApplicationTests.java            # ✅ Có
├── pom.xml                                                         # ✅ Có
└── README.md                                                       # ✅ Có
```

> Nếu cần auth/JWT đầy đủ, cần bổ sung thêm các class trong security (ví dụ JwtFilter, JwtProvider, UserDetailsServiceImpl) và thư mục exception để chuẩn hóa lỗi.

## TODO (backend)

1. Hoàn thiện entity còn thiếu (attendance, payroll, leave, recruitment...).
2. Bổ sung repository cho các entity mới.
3. Tạo service + service impl tương ứng.
4. Tạo controller REST theo endpoint trong README gốc.
5. Thêm validation và xử lý lỗi thống nhất.
6. Bổ sung auth + JWT (nếu chưa hoàn thiện).
