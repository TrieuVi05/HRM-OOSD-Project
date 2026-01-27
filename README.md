# HRM - Employee Management System

> **Hệ thống quản lý nhân sự toàn diện cho doanh nghiệp**

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

---

## Giới Thiệu Dự Án

**HRM** là ứng dụng web quản lý nhân sự giúp doanh nghiệp quản lý thông tin nhân viên, chấm công, tính lương, đánh giá hiệu suất và quản lý tuyển dụng một cách hiệu quả.

### Vai Trò Người Dùng

- **Admin/HR Manager**: Quản lý toàn bộ hệ thống, nhân viên, phòng ban, chấm công, tính lương
- **Department Manager**: Quản lý nhân viên trong phòng ban, phê duyệt nghỉ phép, đánh giá hiệu suất
- **Employee**: Xem thông tin cá nhân, chấm công, đăng ký nghỉ phép, xem lương

---

## Kiến Trúc Hệ Thống

### Kiến Trúc Tổng Quan

```text
┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│   React. js     │  REST   │  Spring Boot   │  JDBC   │    MySQL       │
│   Frontend     │ <-----> │    Backend     │ <-----> │   Database     │
│  Port:  5173    │   API   │  Port: 8080    │         │  Port: 3306    │
└────────────────┘         └────────────────┘         └────────────────┘
```

### Layered Architecture

```text
┌─────────────────────────────────────────────────────┐
│           Frontend (ReactJS)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │    HR    │  │   Dept   │  │ Employee │          │
│  │Dashboard │  │Dashboard │  │Dashboard │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                       ↕ REST API
┌─────────────────────────────────────────────────────┐
│        Backend (Spring Boot + JWT)                   │
│                                                       │
│  ┌──────────────────────────────────────┐           │
│  │      Controller Layer                │           │
│  └──────────────────────────────────────┘           │
│                    ↕                                 │
│  ┌──────────────────────────────────────┐           │
│  │      Service Layer                   │           │
│  └──────────────────────────────────────┘           │
│                    ↕                                 │
│  ┌──────────────────────────────────────┐           │
│  │      Repository Layer (JPA)          │           │
│  └──────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────────┐
│           Database (MySQL)                           │
│  Employees | Departments | Attendance | Payroll     │
└─────────────────────────────────────────────────────┘
```

---

## Công Nghệ Sử Dụng

### Backend

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Security:** Spring Security + JWT
- **Database:** MySQL 8.0+
- **ORM:** Spring Data JPA (Hibernate)
- **Build Tool:** Maven 3.8+

### Frontend

- **Framework:** React 18.2.0 + TypeScript
- **Build Tool:** Vite 5.0.8
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios
- **UI Framework:** React Bootstrap 5.3.2
- **Charts:** Chart.js + React-Chartjs-2

### Database

- **DBMS:** MySQL 8.0+
- **Design:** Relational database with normalized tables

---

## Cấu Trúc Dự Án

```text
HRM-EmployeeManagement/
├── backend/                  # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hrm/
│   │   │   │   ├── HrmApplication.java
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   ├── security/
│   │   │   │   └── exception/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── database/
│   ├── scripted/
│   │   └── database.sql
│   └── README.md
│
└── docs/
    └── API_ENDPOINTS.md
```

---

## Database Schema

### Core Tables

1. **roles** - Vai trò hệ thống
2. **users** - Tài khoản đăng nhập
3. **employees** - Thông tin nhân viên
4. **departments** - Phòng ban
5. **positions** - Chức vụ
6. **attendance** - Chấm công
7. **leaves** - Nghỉ phép
8. **payroll** - Bảng lương
9. **performance_reviews** - Đánh giá hiệu suất
10. **recruitments** - Tuyển dụng

---

## Tính Năng Chính

### 1. Authentication & Authorization

- Đăng nhập/Đăng xuất với JWT
- Role-based access control
- Đổi mật khẩu

### 2. Employee Management

- CRUD thông tin nhân viên
- Quản lý hồ sơ cá nhân
- Upload ảnh đại diện

### 3. Department Management

- Quản lý phòng ban
- Quản lý chức vụ

### 4. Attendance Management

- Chấm công vào/ra
- Xem lịch sử chấm công
- Thống kê giờ làm việc

### 5. Leave Management

- Đăng ký nghỉ phép
- Phê duyệt/Từ chối
- Theo dõi số ngày phép

### 6. Payroll Management

- Tính lương tự động
- Xem phiếu lương
- Xuất báo cáo

### 7. Performance Review

- Đánh giá hiệu suất
- Thiết lập KPI

### 8. Reports & Analytics

- Dashboard tổng quan
- Báo cáo nhân sự
- Biểu đồ thống kê

---

## API Endpoints

### Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/change-password
```

### Employee Management

```
GET    /api/employees
GET    /api/employees/{id}
POST   /api/employees
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

### Department Management

```
GET    /api/departments
POST   /api/departments
PUT    /api/departments/{id}
DELETE /api/departments/{id}
```

### Attendance Management

```
GET    /api/attendance
POST   /api/attendance/checkin
POST   /api/attendance/checkout
GET    /api/attendance/report
```

### Leave Management

```
GET    /api/leaves
POST   /api/leaves
PUT    /api/leaves/{id}/approve
PUT    /api/leaves/{id}/reject
```

### Payroll Management

```
GET    /api/payroll
POST   /api/payroll/generate
GET    /api/payroll/{id}/payslip
```

---

## Quick Start

### Yêu Cầu Hệ Thống

- Java JDK 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/hrm-employee-management.git
cd hrm-employee-management
```

### Bước 2: Cấu Hình Database

```sql
CREATE DATABASE HRM_DB;
```

Cập nhật `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/HRM_DB
spring.datasource.username=root
spring.datasource.password=YourPassword123
```

### Bước 3: Chạy Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend:  **http://localhost:8080**

### Bước 4: Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: **http://localhost:5173**

---

## Tài Khoản Mặc Định

| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | HR_ADMIN |
| manager1 | 123456 | MANAGER |
| employee1 | 123456 | EMPLOYEE |

---

## Design Patterns

### 1. MVC Pattern

- Model: Entity classes
- View:  React components
- Controller: Spring REST Controllers

### 2. Layered Architecture

- Presentation Layer (Controller)
- Business Layer (Service)
- Data Access Layer (Repository)

### 3. Repository Pattern

- Spring Data JPA repositories

### 4. DTO Pattern

- Request/Response DTOs

### 5. Dependency Injection

- Spring IoC container

---

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Build & Deploy

### Backend

```bash
cd backend
mvn clean package
java -jar target/hrm-backend-1.0.0.jar
```

### Frontend

```bash
cd frontend
npm run build
```

---

## Roadmap

### Phase 1: Setup & Authentication (Tuần 1)

- Setup project structure
- Database schema design
- JWT Authentication

### Phase 2: Core Features (Tuần 2-3)

- Employee management
- Department management
- Attendance management

### Phase 3: Advanced Features (Tuần 4-5)

- Leave management
- Payroll management
- Performance review

### Phase 4: Reports & Deploy (Tuần 6)

- Dashboard & reports
- Testing
- Deployment

---

## License

Dự án được phát triển cho mục đích học tập.

---

**Good luck! **
