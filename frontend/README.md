# Frontend (HRM)

## 📁 Cấu Trúc Thư Mục

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                     # Images, fonts
│   ├── components/                 # Reusable components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── employee/
│   │   │   └── EmployeeCard.jsx
│   │   ├── department/
│   │   │   └── DepartmentCard.jsx
│   │   ├── attendance/
│   │   │   └── AttendanceRow.jsx
│   │   ├── leave/
│   │   │   └── LeaveRequestCard.jsx
│   │   ├── payroll/
│   │   │   └── PayrollSlipCard.jsx
│   │   ├── performance/
│   │   │   └── PerformanceReviewCard.jsx
│   │   └── recruitment/
│   │       └── CandidateCard.jsx
│   ├── context/                    # React Context
│   │   └── AuthContext.jsx
│   ├── pages/                      # Page components (tách theo role + layout)
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── RoleLayout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ManagerLayout.jsx
│   │   │   └── EmployeeLayout.jsx
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── UnauthorizedPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   ├── manager/
│   │   │   └── ManagerDashboard.jsx
│   │   ├── employee/
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── shared/                 # Dùng chung cho nhiều role
│   │   │   ├── EmployeesPage.jsx
│   │   │   ├── EmployeeDetailPage.jsx
│   │   │   ├── DepartmentsPage.jsx
│   │   │   ├── PositionsPage.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── TimesheetPage.jsx
│   │   │   ├── LeavesPage.jsx
│   │   │   ├── LeaveApprovalPage.jsx
│   │   │   ├── PayrollPage.jsx
│   │   │   ├── PayslipPage.jsx
│   │   │   ├── PerformanceReviewPage.jsx
│   │   │   ├── RecruitmentPage.jsx
│   │   │   ├── CandidateListPage.jsx
│   │   │   └── InterviewSchedulePage.jsx
│   ├── services/                   # API calls
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── employeeService.js
│   │   ├── departmentService.js
│   │   ├── positionService.js
│   │   ├── attendanceService.js
│   │   ├── timesheetService.js
│   │   ├── leaveService.js
│   │   ├── payrollService.js
│   │   ├── performanceService.js
│   │   ├── recruitmentService.js
│   │   ├── candidateService.js
│   │   └── interviewService.js
│   ├── utils/                      # Utility functions
│   │   └── constants.js
│   ├── styles/                     # CSS files
│   ├── App.jsx                     # Main App component
│   ├── App.css
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── .env                            # Environment variables
├── vite.config.js                  # Vite configuration
├── package.json                    # Dependencies
└── README.md
```

## 🚀 Chạy Frontend

### Bước 1: Cài Đặt Dependencies

```
npm install
```

### Bước 2: Chạy Development Server

```
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

### Bước 3: Build Production

```
npm run build
```

## 📝 TODO: Các Thành Phần Cần Code

1. **Context (src/context/)**
  - AuthContext.jsx - Quản lý authentication state, token, role
2. **Services (src/services/)**
  - api.js - Axios instance với interceptors
  - authService.js - Login, Logout, Change password
  - userService.js - User CRUD
  - employeeService.js - Employee CRUD
  - departmentService.js - Department CRUD
  - positionService.js - Position CRUD
  - attendanceService.js - Check-in/Check-out
  - timesheetService.js - Timesheet CRUD
  - leaveService.js - Leave CRUD + approve/reject
  - payrollService.js - Generate payroll + payslip
  - performanceService.js - Performance review CRUD
  - recruitmentService.js - Recruitment CRUD
  - candidateService.js - Candidate CRUD
  - interviewService.js - Interview schedule
3. **Components (src/components/)**
  - Header.jsx - Navigation bar
  - Footer.jsx
  - ProtectedRoute.jsx - Route guard
  - LoginForm.jsx
  - RegisterForm.jsx
  - EmployeeCard.jsx
  - DepartmentCard.jsx
  - AttendanceRow.jsx
  - LeaveRequestCard.jsx
  - PayrollSlipCard.jsx
  - PerformanceReviewCard.jsx
  - CandidateCard.jsx
4. **Pages (src/pages/)**
  - layouts/
    - PublicLayout.jsx
    - RoleLayout.jsx
    - AdminLayout.jsx
    - ManagerLayout.jsx
    - EmployeeLayout.jsx
  - public/
    - HomePage.jsx
    - LoginPage.jsx
    - RegisterPage.jsx
    - UnauthorizedPage.jsx
  - admin/
    - AdminDashboard.jsx
  - manager/
    - ManagerDashboard.jsx
  - employee/
    - EmployeeDashboard.jsx
  - shared/
    - EmployeesPage.jsx
    - EmployeeDetailPage.jsx
    - DepartmentsPage.jsx
    - PositionsPage.jsx
    - AttendancePage.jsx
    - TimesheetPage.jsx
    - LeavesPage.jsx
    - LeaveApprovalPage.jsx
    - PayrollPage.jsx
    - PayslipPage.jsx
    - PerformanceReviewPage.jsx
    - RecruitmentPage.jsx
    - CandidateListPage.jsx
    - InterviewSchedulePage.jsx

## 📚 Hướng Dẫn Chi Tiết

Xem file: docs/huongdan/03 Frontend.md
