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
│   │   │               │   ├── JwtAuthenticationFilter.java         # ✅ Có
│   │   │               │   ├── JwtTokenProvider.java                # ✅ Có
│   │   │               │   ├── SecurityConfig.java                  # ✅ Có
│   │   │               │   └── UserDetailsServiceImpl.java          # ✅ Có
│   │   │               ├── controller/                             # REST Controllers
│   │   │               │   ├── AuthController.java                  # ✅ Có
│   │   │               │   ├── AttendanceController.java           # ✅ Có
│   │   │               │   ├── CandidateController.java            # ✅ Có
│   │   │               │   ├── ContractController.java             # ✅ Có
│   │   │               │   ├── DepartmentController.java           # ✅ Có
│   │   │               │   ├── EmployeeController.java             # ✅ Có
│   │   │               │   ├── InterviewController.java            # ✅ Có
│   │   │               │   ├── LeaveRequestController.java         # ✅ Có
│   │   │               │   ├── PayrollController.java              # ✅ Có
│   │   │               │   ├── PerformanceReviewController.java    # ✅ Có
│   │   │               │   ├── PositionController.java             # ✅ Có
│   │   │               │   ├── RecruitmentController.java          # ✅ Có
│   │   │               │   ├── RoleController.java                 # ✅ Có
│   │   │               │   ├── TestController.java                 # ✅ Có
│   │   │               │   ├── TimesheetController.java            # ✅ Có
│   │   │               │   ├── UserController.java                 # ✅ Có
│   │   │               │   └── WorkScheduleController.java         # ✅ Có
│   │   │               ├── dto/                                    # Data Transfer Objects
│   │   │               │   ├── AuthRequest.java                     # ✅ Có
│   │   │               │   ├── AuthResponse.java                    # ✅ Có
│   │   │               │   ├── ChangePasswordRequest.java           # ✅ Có
│   │   │               │   ├── AttendanceRequest.java              # ✅ Có
│   │   │               │   ├── AttendanceResponse.java             # ✅ Có
│   │   │               │   ├── CandidateRequest.java               # ✅ Có
│   │   │               │   ├── CandidateResponse.java              # ✅ Có
│   │   │               │   ├── ContractRequest.java                # ✅ Có
│   │   │               │   ├── ContractResponse.java               # ✅ Có
│   │   │               │   ├── DepartmentRequest.java              # ✅ Có
│   │   │               │   ├── DepartmentResponse.java             # ✅ Có
│   │   │               │   ├── EmployeeRequest.java                # ✅ Có
│   │   │               │   ├── EmployeeResponse.java               # ✅ Có
│   │   │               │   ├── InterviewRequest.java               # ✅ Có
│   │   │               │   ├── InterviewResponse.java              # ✅ Có
│   │   │               │   ├── LeaveRequestRequest.java            # ✅ Có
│   │   │               │   ├── LeaveRequestResponse.java           # ✅ Có
│   │   │               │   ├── PayrollRequest.java                 # ✅ Có
│   │   │               │   ├── PayrollResponse.java                # ✅ Có
│   │   │               │   ├── PerformanceReviewRequest.java       # ✅ Có
│   │   │               │   ├── PerformanceReviewResponse.java      # ✅ Có
│   │   │               │   ├── PositionRequest.java                # ✅ Có
│   │   │               │   ├── PositionResponse.java               # ✅ Có
│   │   │               │   ├── RecruitmentRequest.java             # ✅ Có
│   │   │               │   ├── RecruitmentResponse.java            # ✅ Có
│   │   │               │   ├── RoleRequest.java                    # ✅ Có
│   │   │               │   ├── RoleResponse.java                   # ✅ Có
│   │   │               │   ├── TimesheetRequest.java               # ✅ Có
│   │   │               │   ├── TimesheetResponse.java              # ✅ Có
│   │   │               │   ├── UserRequest.java                    # ✅ Có
│   │   │               │   ├── UserResponse.java                   # ✅ Có
│   │   │               │   ├── WorkScheduleRequest.java            # ✅ Có
│   │   │               │   └── WorkScheduleResponse.java           # ✅ Có
│   │   │               ├── entity/                                 # JPA Entities
│   │   │               │   ├── Attendance.java                      # ✅ Có
│   │   │               │   ├── Candidate.java                       # ✅ Có
│   │   │               │   ├── Contract.java                        # ✅ Có
│   │   │               │   ├── Department.java                      # ✅ Có
│   │   │               │   ├── Employee.java                        # ✅ Có
│   │   │               │   ├── Interview.java                       # ✅ Có
│   │   │               │   ├── LeaveRequest.java                    # ✅ Có
│   │   │               │   ├── Payroll.java                         # ✅ Có
│   │   │               │   ├── PerformanceReview.java               # ✅ Có
│   │   │               │   ├── Position.java                        # ✅ Có
│   │   │               │   ├── Recruitment.java                     # ✅ Có
│   │   │               │   ├── Role.java                            # ✅ Có
│   │   │               │   ├── Timesheet.java                       # ✅ Có
│   │   │               │   ├── User.java                            # ✅ Có
│   │   │               │   ├── UserRole.java                        # ✅ Có
│   │   │               │   └── UserRoleId.java                      # ✅ Có
│   │   │               │   └── WorkSchedule.java                    # ✅ Có
│   │   │               ├── repository/                             # JPA Repositories
│   │   │               │   ├── AttendanceRepository.java           # ✅ Có
│   │   │               │   ├── CandidateRepository.java            # ✅ Có
│   │   │               │   ├── ContractRepository.java             # ✅ Có
│   │   │               │   ├── DepartmentRepository.java           # ✅ Có
│   │   │               │   ├── EmployeeRepository.java             # ✅ Có
│   │   │               │   ├── InterviewRepository.java            # ✅ Có
│   │   │               │   ├── LeaveRequestRepository.java         # ✅ Có
│   │   │               │   ├── PayrollRepository.java              # ✅ Có
│   │   │               │   ├── PerformanceReviewRepository.java    # ✅ Có
│   │   │               │   ├── PositionRepository.java             # ✅ Có
│   │   │               │   ├── RecruitmentRepository.java          # ✅ Có
│   │   │               │   ├── RoleRepository.java                 # ✅ Có
│   │   │               │   ├── TimesheetRepository.java            # ✅ Có
│   │   │               │   ├── UserRepository.java                 # ✅ Có
│   │   │               │   ├── UserRoleRepository.java             # ✅ Có
│   │   │               │   └── WorkScheduleRepository.java         # ✅ Có
│   │   │               ├── service/                                # Business Logic
│   │   │               │   ├── AttendanceService.java              # ✅ Có
│   │   │               │   ├── AttendanceServiceImpl.java          # ✅ Có
│   │   │               │   ├── CandidateService.java               # ✅ Có
│   │   │               │   ├── CandidateServiceImpl.java           # ✅ Có
│   │   │               │   ├── ContractService.java                # ✅ Có
│   │   │               │   ├── ContractServiceImpl.java            # ✅ Có
│   │   │               │   ├── DepartmentService.java              # ✅ Có
│   │   │               │   ├── DepartmentServiceImpl.java          # ✅ Có
│   │   │               │   ├── EmployeeService.java                # ✅ Có
│   │   │               │   ├── EmployeeServiceImpl.java            # ✅ Có
│   │   │               │   ├── InterviewService.java               # ✅ Có
│   │   │               │   ├── InterviewServiceImpl.java           # ✅ Có
│   │   │               │   ├── LeaveRequestService.java            # ✅ Có
│   │   │               │   ├── LeaveRequestServiceImpl.java        # ✅ Có
│   │   │               │   ├── PayrollService.java                 # ✅ Có
│   │   │               │   ├── PayrollServiceImpl.java             # ✅ Có
│   │   │               │   ├── PerformanceReviewService.java       # ✅ Có
│   │   │               │   ├── PerformanceReviewServiceImpl.java   # ✅ Có
│   │   │               │   ├── PositionService.java                # ✅ Có
│   │   │               │   ├── PositionServiceImpl.java            # ✅ Có
│   │   │               │   ├── RecruitmentService.java             # ✅ Có
│   │   │               │   ├── RecruitmentServiceImpl.java         # ✅ Có
│   │   │               │   ├── RoleService.java                    # ✅ Có
│   │   │               │   ├── RoleServiceImpl.java                # ✅ Có
│   │   │               │   ├── TimesheetService.java               # ✅ Có
│   │   │               │   ├── TimesheetServiceImpl.java           # ✅ Có
│   │   │               │   ├── UserService.java                    # ✅ Có
│   │   │               │   ├── UserServiceImpl.java                # ✅ Có
│   │   │               │   ├── WorkScheduleService.java            # ✅ Có
│   │   │               │   └── WorkScheduleServiceImpl.java        # ✅ Có
│   │   │               └── exception/                              # Exception handling
│   │   │                   ├── BadRequestException.java            # ✅ Có
│   │   │                   ├── GlobalExceptionHandler.java         # ✅ Có
│   │   │                   └── ResourceNotFoundException.java      # ✅ Có
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

> Nếu cần auth/JWT đầy đủ, cần bổ sung thêm các class trong security (ví dụ JwtFilter, JwtProvider, UserDetailsServiceImpl).

## TODO (backend)

1. Chuẩn hóa validation cho DTO (annotation và message).
2. Thêm nghiệp vụ chuyên sâu: approve leave, generate payroll, check-in/out.
3. Mở rộng phân quyền theo role (authorize theo endpoint).
