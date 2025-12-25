# HRM-OOSD-Project
HRM – Employee Management System
🏢 HRM - Employee Management System
Hệ thống quản lý nhân sự toàn diện cho doanh nghiệp

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-red)

📖 Giới Thiệu Dự Án
HRM là ứng dụng web quản lý nhân sự giúp doanh nghiệp quản lý thông tin nhân viên, chấm công, tính lương, đánh giá hiệu suất và quản lý tuyển dụng một cách hiệu quả.

Vai Trò Người Dùng
👤 Admin/HR Manager: Quản lý toàn bộ hệ thống, nhân viên, phòng ban, chấm công, tính lương
👨‍💼 Department Manager: Quản lý nhân viên trong phòng ban, phê duyệt nghỉ phép, đánh giá hiệu suất
👨‍💻 Employee: Xem thông tin cá nhân, chấm công, đăng ký nghỉ phép, xem lương
🏗️ Kiến Trúc Hệ Thống
Kiến Trúc Tổng Quan (3-Tier Architecture)
Code
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│   React. js     │  REST   │  Spring Boot   │  JDBC   │  SQL Server    │
│   Frontend     │ ◄─────► │    Backend     │ ◄─────► │   Database     │
│  Port: 5173    │   API   │  Port: 8080    │         │  Port: 1433    │
└────────────────┘         └────────────────┘         └────────────────┘
Kiến Trúc Chi Tiết (Layered Architecture)
Code
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (ReactJS)                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │   HR     │  │  Dept    │  │ Employee  │  │   Auth    │  │
│  │Dashboard │  │Dashboard │  │ Dashboard │  │  Pages    │  │
│  └──────────┘  └──────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│              Backend (Spring Boot + JWT)                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Auth    │  │   HR     │  │   Dept    │  │ Employee  │  │
│  │Controller│  │Controller│  │Controller │  │Controller │  │
│  └──────────┘  └──────────┘  └───────────┘  └───────────┘  │
│       ↕              ↕              ↕              ↕         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Service Layer                            │   │
│  └──────────────────────────────────────────────────────┘   │
│       ↕              ↕              ↕              ↕         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Repository Layer (JPA)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────┐
│              Database (SQL Server)                           │
│  Employees | Departments | Attendance | Payroll | ...         │
└─────────────────────────────────────────────────────────────┘
🛠️ Công Nghệ Sử Dụng
Backend
Framework: Spring Boot 3.2.0
Language: Java 17
Security: Spring Security + JWT
Database: SQL Server 2019+
ORM: Spring Data JPA (Hibernate)
Build Tool: Maven 3.8+
Validation: Bean Validation (Hibernate Validator)
Frontend
Framework: React 18.2.0 + TypeScript
Build Tool: Vite 5.0.8
Routing: React Router DOM 6.20.0
HTTP Client: Axios
UI Framework: React Bootstrap 5.3.2 / Ant Design / Material-UI
Charts: Chart.js + React-Chartjs-2
State Management: React Context API / Redux Toolkit
Form Handling: React Hook Form + Yup validation
Database
DBMS: Microsoft SQL Server 2019+
Design: Relational database with normalized tables
Indexes: Optimized for performance
📁 Cấu Trúc Dự Án
Code
HRM-EmployeeManagement/
├── backend/                  # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hrm/
│   │   │   │   ├── HrmApplication.java      # Main Application
│   │   │   │   ├── config/                  # Configuration Classes
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── JpaConfig.java
│   │   │   │   ├── controller/              # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── EmployeeController.java
│   │   │   │   │   ├── DepartmentController.java
│   │   │   │   │   ├── AttendanceController.java
│   │   │   │   │   ├── PayrollController.java
│   │   │   │   │   ├── LeaveController.java
│   │   │   │   │   └── PerformanceController.java
│   │   │   │   ├── dto/                     # Data Transfer Objects
│   │   │   │   │   ├── request/
│   │   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   │   ├── EmployeeRequest.java
│   │   │   │   │   │   ├── AttendanceRequest.java
│   │   │   │   │   │   └── LeaveRequest.java
│   │   │   │   │   └── response/
│   │   │   │   │       ├── JwtResponse.java
│   │   │   │   │       ├── EmployeeResponse.java
│   │   │   │   │       ├── PayrollResponse.java
│   │   │   │   │       └── MessageResponse.java
│   │   │   │   ├── entity/                  # JPA Entities
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   ├── Employee.java
│   │   │   │   │   ├── Department.java
│   │   │   │   │   ├── Position.java
│   │   │   │   │   ├── Attendance.java
│   │   │   │   │   ├── Leave.java
│   │   │   │   │   ├── Payroll.java
│   │   │   │   │   ├── Performance.java
│   │   │   │   │   └── Recruitment.java
│   │   │   │   ├── repository/              # JPA Repositories
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── RoleRepository.java
│   │   │   │   │   ├── EmployeeRepository.java
│   │   │   │   │   ├── DepartmentRepository.java
│   │   │   │   │   ├── AttendanceRepository.java
│   │   │   │   │   ├── LeaveRepository.java
│   │   │   │   │   ├── PayrollRepository.java
│   │   │   │   │   └── PerformanceRepository.java
│   │   │   │   ├── service/                 # Business Logic
│   │   │   │   │   ├── impl/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── EmployeeService.java
│   │   │   │   │   ├── DepartmentService.java
│   │   │   │   │   ├── AttendanceService.java
│   │   │   │   │   ├── PayrollService.java
│   │   │   │   │   ├── LeaveService.java
│   │   │   │   │   └── PerformanceService.java
│   │   │   │   ├── security/                # Security Components
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │   ├── exception/               # Exception Handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── UnauthorizedException.java
│   │   │   │   └── util/                    # Utility Classes
│   │   │   │       ├── DateUtils.java
│   │   │   │       └── PayrollCalculator.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-dev.properties
│   │   │       └── application-prod. properties
│   │   └── test/                            # Unit & Integration Tests
│   └── pom.xml                              # Maven Configuration
│
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                          # Images, Icons, CSS
│   │   ├── components/                      # Reusable Components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── ChangePasswordForm.jsx
│   │   │   ├── employee/
│   │   │   │   ├── EmployeeTable.jsx
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   └── EmployeeCard.jsx
│   │   │   ├── attendance/
│   │   │   │   ├── AttendanceTable.jsx
│   │   │   │   └── CheckInOutForm.jsx
│   │   │   ├── payroll/
│   │   │   │   ├── PayrollTable. jsx
│   │   │   │   └── PayslipModal.jsx
│   │   │   └── leave/
│   │   │       ├── LeaveRequestForm.jsx
│   │   │       └── LeaveApprovalTable.jsx
│   │   ├── context/                         # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/                           # Page Components
│   │   │   ├── auth/
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── hr/
│   │   │   │   ├── HRDashboard.jsx
│   │   │   │   ├── EmployeeListPage.jsx
│   │   │   │   ├── EmployeeDetailPage. jsx
│   │   │   │   ├── AttendanceManagementPage.jsx
│   │   │   │   ├── PayrollManagementPage.jsx
│   │   │   │   ├── LeaveManagementPage.jsx
│   │   │   │   └── RecruitmentPage.jsx
│   │   │   ├── manager/
│   │   │   │   ├── ManagerDashboard.jsx
│   │   │   │   ├── TeamManagementPage.jsx
│   │   │   │   ├── LeaveApprovalPage.jsx
│   │   │   │   └── PerformanceReviewPage.jsx
│   │   │   ├── employee/
│   │   │   │   ├── EmployeeDashboard.jsx
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   ├── AttendancePage.jsx
│   │   │   │   ├── LeaveRequestPage.jsx
│   │   │   │   └── PayslipPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/                        # API Services
│   │   │   ├── api. js                       # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── employeeService.js
│   │   │   ├── departmentService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── payrollService.js
│   │   │   ├── leaveService. js
│   │   │   └── performanceService.js
│   │   ├── utils/                           # Utility Functions
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── dateFormatter.js
│   │   ├── routes/                          # Route Configuration
│   │   │   └── AppRoutes.jsx
│   │   ├── App.jsx                          # Main App Component
│   │   ├── App.css
│   │   ├── main.jsx                         # Entry Point
│   │   └── index.css
│   ├── . env                                 # Environment Variables
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── database/                 # SQL Scripts
│   ├── schema.sql           # Database Schema
│   ├── seed-data.sql        # Sample Data
│   └── README.md
│
└── docs/                     # Documentation
    ├── API_ENDPOINTS.md
    ├── DATABASE_SCHEMA.md
    ├── SETUP_GUIDE.md
    └── USER_MANUAL.md
🗄️ Database Schema
Core Tables (12 tables)
roles - Vai trò hệ thống (ADMIN, MANAGER, EMPLOYEE)
users - Tài khoản đăng nhập
employees - Thông tin nhân viên
departments - Phòng ban
positions - Chức vụ
attendance - Chấm công
leaves - Nghỉ phép
payroll - Bảng lương
performance_reviews - Đánh giá hiệu suất
recruitments - Tuyển dụng
benefits - Phúc lợi
training - Đào tạo
Database ERD (Entity Relationship Diagram)
Code
┌──────────┐         ┌──────────────┐         ┌────────────┐
│  users   │ 1──1 ───│  employees   │───M──1  │departments │
└──────────┘         └──────────────┘         └────────────┘
                            │
                            │ 1
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              M             M             M
        ┌──────────┐  ┌──────────┐  ┌─────────┐
        │attendance│  │  leaves  │  │ payroll │
        └──────────┘  └──────────┘  └─────────┘
✨ Tính Năng Chính
1. 🔐 Authentication & Authorization
Đăng nhập/Đăng xuất với JWT
Role-based access control (ADMIN, MANAGER, EMPLOYEE)
Đổi mật khẩu, quên mật khẩu
2. 👥 Employee Management
CRUD thông tin nhân viên
Quản lý hồ sơ cá nhân
Upload ảnh đại diện
Lịch sử công việc
3. 🏢 Department & Position Management
Quản lý phòng ban
Quản lý chức vụ
Phân công nhân viên vào phòng ban
4. ⏰ Attendance Management
Chấm công vào/ra
Xem lịch sử chấm công
Thống kê giờ làm việc
Tính giờ làm thêm
5. 🏖️ Leave Management
Đăng ký nghỉ phép
Phê duyệt/Từ chối nghỉ phép
Theo dõi số ngày phép còn lại
Lịch sử nghỉ phép
6. 💰 Payroll Management
Tính lương tự động
Xem phiếu lương
Xuất báo cáo lương
Quản lý các khoản phụ cấp
7. 📊 Performance Review
Đánh giá hiệu suất định kỳ
Thiết lập KPI
Báo cáo hiệu suất
Lịch sử đánh giá
8. 📈 Reports & Analytics
Dashboard tổng quan
Báo cáo nhân sự
Báo cáo chấm công
Báo cáo lương
Biểu đồ thống kê
9. 🎯 Recruitment (Optional)
Đăng tin tuyển dụng
Quản lý ứng viên
Lịch phỏng vấn
🔐 API Endpoints
Authentication
Code
POST   /api/auth/login          # Đăng nhập
POST   /api/auth/logout         # Đăng xuất
POST   /api/auth/refresh        # Refresh token
GET    /api/auth/me             # Lấy thông tin user hiện tại
PUT    /api/auth/change-password # Đổi mật khẩu
Employee Management
Code
GET    /api/employees           # Danh sách nhân viên
GET    /api/employees/{id}      # Chi tiết nhân viên
POST   /api/employees           # Tạo nhân viên mới
PUT    /api/employees/{id}      # Cập nhật nhân viên
DELETE /api/employees/{id}      # Xóa nhân viên
GET    /api/employees/{id}/profile # Hồ sơ cá nhân
Department Management
Code
GET    /api/departments         # Danh sách phòng ban
GET    /api/departments/{id}    # Chi tiết phòng ban
POST   /api/departments         # Tạo phòng ban
PUT    /api/departments/{id}    # Cập nhật phòng ban
DELETE /api/departments/{id}    # Xóa phòng ban
Attendance Management
Code
GET    /api/attendance          # Lịch sử chấm công
POST   /api/attendance/checkin  # Check-in
POST   /api/attendance/checkout # Check-out
GET    /api/attendance/report   # Báo cáo chấm công
Leave Management
Code
GET    /api/leaves              # Danh sách nghỉ phép
GET    /api/leaves/{id}         # Chi tiết đơn nghỉ phép
POST   /api/leaves              # Tạo đơn nghỉ phép
PUT    /api/leaves/{id}/approve # Phê duyệt
PUT    /api/leaves/{id}/reject  # Từ chối
Payroll Management
Code
GET    /api/payroll             # Danh sách bảng lương
GET    /api/payroll/{id}        # Chi tiết bảng lương
POST   /api/payroll/generate    # Tạo bảng lương
GET    /api/payroll/{id}/payslip # Phiếu lương
Performance Management
Code
GET    /api/performance         # Danh sách đánh giá
POST   /api/performance         # Tạo đánh giá mới
GET    /api/performance/{id}    # Chi tiết đánh giá
🚀 Quick Start
Yêu Cầu Hệ Thống
☕ Java JDK: 17+
📦 Maven: 3.8+
🟢 Node.js: 18+
🗄️ SQL Server: 2019+
🔧 IDE: IntelliJ IDEA / Eclipse / VS Code
Bước 1: Clone Repository
bash
git clone https://github.com/your-username/hrm-employee-management.git
cd hrm-employee-management
Bước 2: Cấu Hình Database
SQL
-- Tạo database
CREATE DATABASE HRM_DB;

-- Chạy schema
-- Import file database/schema.sql

-- Import dữ liệu mẫu
-- Import file database/seed-data.sql
Cập nhật backend/src/main/resources/application.properties:

properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=HRM_DB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword123
Bước 3: Chạy Backend
bash
cd backend
mvn clean install
mvn spring-boot:run
Backend chạy tại: http://localhost:8080

Bước 4: Chạy Frontend
bash
cd frontend
npm install
npm run dev
Frontend chạy tại: http://localhost:5173

👥 Tài Khoản Mặc Định
Username	Password	Role	Description
admin	Admin@123	HR_ADMIN	Quản trị viên HR
manager1	Manager@123	MANAGER	Quản lý phòng ban
employee1	Employee@123	EMPLOYEE	Nhân viên thường
📊 Design Patterns
1. MVC Pattern
Model: Entity classes
View: React components
Controller: Spring REST Controllers
2. Layered Architecture
Presentation Layer (Controller)
Business Layer (Service)
Data Access Layer (Repository)
Database Layer
3. Repository Pattern
Spring Data JPA repositories
Custom queries với @Query
4. DTO Pattern
Request DTOs cho input validation
Response DTOs cho output formatting
5. Dependency Injection
Spring IoC container
Constructor injection
6. Builder Pattern (Optional)
Dùng Lombok @Builder cho entities
🧪 Testing
Backend Tests
bash
cd backend
mvn test                    # Run all tests
mvn test -Dtest=EmployeeServiceTest  # Run specific test
Frontend Tests
bash
cd frontend
npm test                    # Run tests
npm run test:coverage       # Run with coverage
📦 Build & Deploy
Backend (JAR)
bash
cd backend
mvn clean package
java -jar target/hrm-backend-1.0.0.jar
Frontend (Production Build)
bash
cd frontend
npm run build
# Deploy thư mục dist/
📚 Tài Liệu Tham Khảo
Spring Boot Documentation
React Documentation
Spring Security
React Router
🎯 Roadmap
Phase 1: Setup & Authentication (Tuần 1)
✅ Setup project structure
✅ Database schema design
✅ JWT Authentication
✅ User & Role management
Phase 2: Core Features (Tuần 2-3)
⏳ Employee management
⏳ Department management
⏳ Attendance management
Phase 3: Advanced Features (Tuần 4-5)
⏳ Leave management
⏳ Payroll management
⏳ Performance review
Phase 4: Reports & Deploy (Tuần 6)
⏳ Dashboard & reports
⏳ Testing
⏳ Deployment
📄 License
Dự án này được phát triển cho mục đích học tập.

Good luck với dự án HRM của bạn! 💼✨
