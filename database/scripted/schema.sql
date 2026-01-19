-- HRM full schema (SQL Server)

IF DB_ID('HRM_DB') IS NULL
BEGIN
    CREATE DATABASE HRM_DB;
END
GO

USE HRM_DB;
GO

-- Security & Access Control
IF OBJECT_ID('dbo.roles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.roles (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(255) NULL
    );
END
GO

IF OBJECT_ID('dbo.users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(100) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NULL UNIQUE,
        full_name NVARCHAR(255) NULL,
        phone NVARCHAR(50) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID('dbo.user_roles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_roles (
        user_id BIGINT NOT NULL,
        role_id BIGINT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES dbo.users(id),
        CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES dbo.roles(id)
    );
END
GO

-- Core HR data
IF OBJECT_ID('dbo.departments', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.departments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL UNIQUE,
        description NVARCHAR(1000) NULL
    );
END
GO

IF OBJECT_ID('dbo.positions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.positions (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        department_id BIGINT NULL,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(1000) NULL,
        base_salary DECIMAL(18,2) NULL,
        CONSTRAINT fk_positions_department FOREIGN KEY (department_id) REFERENCES dbo.departments(id)
    );
END
GO

IF OBJECT_ID('dbo.employees', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.employees (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_code NVARCHAR(50) NULL UNIQUE,
        user_id BIGINT NULL,
        department_id BIGINT NULL,
        position_id BIGINT NULL,
        email NVARCHAR(255) NOT NULL,
        fullName NVARCHAR(255) NOT NULL,
        dateOfBirth DATE NULL,
        phone NVARCHAR(50) NULL,
        address NVARCHAR(255) NULL,
        hire_date DATE NULL,
        contract_type NVARCHAR(50) NULL,
        salary DECIMAL(18,2) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        -- Keep simple string fields for current JPA entity compatibility
        department NVARCHAR(255) NULL,
        position NVARCHAR(255) NULL,
        CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES dbo.users(id),
        CONSTRAINT fk_employees_department FOREIGN KEY (department_id) REFERENCES dbo.departments(id),
        CONSTRAINT fk_employees_position FOREIGN KEY (position_id) REFERENCES dbo.positions(id)
    );
END
GO

-- Contracts
IF OBJECT_ID('dbo.contracts', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.contracts (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        contract_type NVARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NULL,
        salary DECIMAL(18,2) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        signed_at DATETIME2 NULL,
        CONSTRAINT fk_contracts_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id)
    );
END
GO

-- Work schedules
IF OBJECT_ID('dbo.work_schedules', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.work_schedules (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        days_of_week NVARCHAR(100) NULL,
        description NVARCHAR(1000) NULL
    );
END
GO

-- Attendance & Timesheet
IF OBJECT_ID('dbo.attendance', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.attendance (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        work_date DATE NOT NULL,
        check_in DATETIME2 NULL,
        check_out DATETIME2 NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'PRESENT',
        schedule_id BIGINT NULL,
        notes NVARCHAR(1000) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id),
        CONSTRAINT fk_attendance_schedule FOREIGN KEY (schedule_id) REFERENCES dbo.work_schedules(id)
    );
END
GO

IF OBJECT_ID('dbo.timesheets', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.timesheets (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        total_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
        overtime_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
        status NVARCHAR(50) NOT NULL DEFAULT 'DRAFT',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_timesheets_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id)
    );
END
GO

-- Leave management
IF OBJECT_ID('dbo.leaves', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.leaves (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        leave_type NVARCHAR(100) NOT NULL,
        reason NVARCHAR(1000) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'PENDING',
        approved_by BIGINT NULL,
        approved_at DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_leaves_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id),
        CONSTRAINT fk_leaves_approver FOREIGN KEY (approved_by) REFERENCES dbo.employees(id)
    );
END
GO

-- Payroll
IF OBJECT_ID('dbo.payroll', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.payroll (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        period_start DATE NOT NULL,
        period_end DATE NOT NULL,
        basic_salary DECIMAL(18,2) NOT NULL DEFAULT 0,
        allowance DECIMAL(18,2) NOT NULL DEFAULT 0,
        bonus DECIMAL(18,2) NOT NULL DEFAULT 0,
        deduction DECIMAL(18,2) NOT NULL DEFAULT 0,
        net_salary AS (basic_salary + allowance + bonus - deduction),
        generated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        status NVARCHAR(50) NOT NULL DEFAULT 'DRAFT',
        CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id)
    );
END
GO

-- Performance reviews
IF OBJECT_ID('dbo.performance_reviews', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.performance_reviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        employee_id BIGINT NOT NULL,
        reviewer_id BIGINT NULL,
        review_period NVARCHAR(100) NOT NULL,
        score DECIMAL(5,2) NULL,
        comments NVARCHAR(2000) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_reviews_employee FOREIGN KEY (employee_id) REFERENCES dbo.employees(id),
        CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES dbo.employees(id)
    );
END
GO

-- Recruitment
IF OBJECT_ID('dbo.recruitments', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.recruitments (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        department_id BIGINT NULL,
        position_id BIGINT NULL,
        openings INT NOT NULL DEFAULT 1,
        status NVARCHAR(50) NOT NULL DEFAULT 'OPEN',
        posted_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        closed_at DATETIME2 NULL,
        description NVARCHAR(2000) NULL,
        CONSTRAINT fk_recruitments_department FOREIGN KEY (department_id) REFERENCES dbo.departments(id),
        CONSTRAINT fk_recruitments_position FOREIGN KEY (position_id) REFERENCES dbo.positions(id)
    );
END
GO

IF OBJECT_ID('dbo.candidates', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.candidates (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        recruitment_id BIGINT NOT NULL,
        full_name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NULL,
        phone NVARCHAR(50) NULL,
        resume_url NVARCHAR(1000) NULL,
        status NVARCHAR(50) NOT NULL DEFAULT 'APPLIED',
        applied_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT fk_candidates_recruitment FOREIGN KEY (recruitment_id) REFERENCES dbo.recruitments(id)
    );
END
GO

IF OBJECT_ID('dbo.interviews', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.interviews (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        candidate_id BIGINT NOT NULL,
        interviewer_id BIGINT NULL,
        scheduled_at DATETIME2 NOT NULL,
        result NVARCHAR(50) NULL,
        notes NVARCHAR(2000) NULL,
        CONSTRAINT fk_interviews_candidate FOREIGN KEY (candidate_id) REFERENCES dbo.candidates(id),
        CONSTRAINT fk_interviews_interviewer FOREIGN KEY (interviewer_id) REFERENCES dbo.employees(id)
    );
END
GO

-- Indexes
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_user_roles_role_id' AND object_id = OBJECT_ID('dbo.user_roles'))
BEGIN
    CREATE INDEX ix_user_roles_role_id ON dbo.user_roles(role_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_positions_department_id' AND object_id = OBJECT_ID('dbo.positions'))
BEGIN
    CREATE INDEX ix_positions_department_id ON dbo.positions(department_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_employees_user_id' AND object_id = OBJECT_ID('dbo.employees'))
BEGIN
    CREATE INDEX ix_employees_user_id ON dbo.employees(user_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_employees_department_id' AND object_id = OBJECT_ID('dbo.employees'))
BEGIN
    CREATE INDEX ix_employees_department_id ON dbo.employees(department_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_employees_position_id' AND object_id = OBJECT_ID('dbo.employees'))
BEGIN
    CREATE INDEX ix_employees_position_id ON dbo.employees(position_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_employees_email' AND object_id = OBJECT_ID('dbo.employees'))
BEGIN
    CREATE INDEX ix_employees_email ON dbo.employees(email);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_attendance_employee_work_date' AND object_id = OBJECT_ID('dbo.attendance'))
BEGIN
    CREATE INDEX ix_attendance_employee_work_date ON dbo.attendance(employee_id, work_date);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_attendance_schedule_id' AND object_id = OBJECT_ID('dbo.attendance'))
BEGIN
    CREATE INDEX ix_attendance_schedule_id ON dbo.attendance(schedule_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_timesheets_employee_period' AND object_id = OBJECT_ID('dbo.timesheets'))
BEGIN
    CREATE INDEX ix_timesheets_employee_period ON dbo.timesheets(employee_id, period_start, period_end);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_leaves_employee_status' AND object_id = OBJECT_ID('dbo.leaves'))
BEGIN
    CREATE INDEX ix_leaves_employee_status ON dbo.leaves(employee_id, status);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_payroll_employee_period' AND object_id = OBJECT_ID('dbo.payroll'))
BEGIN
    CREATE INDEX ix_payroll_employee_period ON dbo.payroll(employee_id, period_start, period_end);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_reviews_employee' AND object_id = OBJECT_ID('dbo.performance_reviews'))
BEGIN
    CREATE INDEX ix_reviews_employee ON dbo.performance_reviews(employee_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_reviews_reviewer' AND object_id = OBJECT_ID('dbo.performance_reviews'))
BEGIN
    CREATE INDEX ix_reviews_reviewer ON dbo.performance_reviews(reviewer_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_recruitments_department' AND object_id = OBJECT_ID('dbo.recruitments'))
BEGIN
    CREATE INDEX ix_recruitments_department ON dbo.recruitments(department_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_recruitments_position' AND object_id = OBJECT_ID('dbo.recruitments'))
BEGIN
    CREATE INDEX ix_recruitments_position ON dbo.recruitments(position_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_candidates_recruitment' AND object_id = OBJECT_ID('dbo.candidates'))
BEGIN
    CREATE INDEX ix_candidates_recruitment ON dbo.candidates(recruitment_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_interviews_candidate' AND object_id = OBJECT_ID('dbo.interviews'))
BEGIN
    CREATE INDEX ix_interviews_candidate ON dbo.interviews(candidate_id);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_interviews_interviewer' AND object_id = OBJECT_ID('dbo.interviews'))
BEGIN
    CREATE INDEX ix_interviews_interviewer ON dbo.interviews(interviewer_id);
END
GO

-- Seed data
IF NOT EXISTS (SELECT 1 FROM dbo.roles WHERE name = 'HR_ADMIN')
BEGIN
    INSERT dbo.roles (name, description) VALUES
    ('HR_ADMIN', 'Admin/HR Manager'),
    ('MANAGER', 'Department Manager'),
    ('EMPLOYEE', 'Employee');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE username = 'admin')
BEGIN
    INSERT dbo.users (username, password_hash, email, full_name, phone, status)
    VALUES ('admin', 'Admin@123', 'admin@hrm.local', 'System Admin', '0900000000', 'ACTIVE');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE username = 'manager1')
BEGIN
    INSERT dbo.users (username, password_hash, email, full_name, phone, status)
    VALUES ('manager1', 'Manager@123', 'manager1@hrm.local', 'Dept Manager', '0900000001', 'ACTIVE');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE username = 'employee1')
BEGIN
    INSERT dbo.users (username, password_hash, email, full_name, phone, status)
    VALUES ('employee1', 'Employee@123', 'employee1@hrm.local', 'Employee One', '0900000002', 'ACTIVE');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = (SELECT id FROM dbo.users WHERE username = 'admin') AND role_id = (SELECT id FROM dbo.roles WHERE name = 'HR_ADMIN'))
BEGIN
    INSERT dbo.user_roles (user_id, role_id)
    SELECT u.id, r.id FROM dbo.users u CROSS JOIN dbo.roles r
    WHERE u.username = 'admin' AND r.name = 'HR_ADMIN';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = (SELECT id FROM dbo.users WHERE username = 'manager1') AND role_id = (SELECT id FROM dbo.roles WHERE name = 'MANAGER'))
BEGIN
    INSERT dbo.user_roles (user_id, role_id)
    SELECT u.id, r.id FROM dbo.users u CROSS JOIN dbo.roles r
    WHERE u.username = 'manager1' AND r.name = 'MANAGER';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.user_roles WHERE user_id = (SELECT id FROM dbo.users WHERE username = 'employee1') AND role_id = (SELECT id FROM dbo.roles WHERE name = 'EMPLOYEE'))
BEGIN
    INSERT dbo.user_roles (user_id, role_id)
    SELECT u.id, r.id FROM dbo.users u CROSS JOIN dbo.roles r
    WHERE u.username = 'employee1' AND r.name = 'EMPLOYEE';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.departments WHERE name = 'HR')
BEGIN
    INSERT dbo.departments (name, description) VALUES
    ('HR', 'Human Resources'),
    ('IT', 'Information Technology'),
    ('Finance', 'Finance & Accounting');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.positions WHERE name = 'HR Manager')
BEGIN
    INSERT dbo.positions (department_id, name, description, base_salary)
    SELECT d.id, 'HR Manager', 'Manage HR operations', 2500
    FROM dbo.departments d WHERE d.name = 'HR';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.positions WHERE name = 'Software Engineer')
BEGIN
    INSERT dbo.positions (department_id, name, description, base_salary)
    SELECT d.id, 'Software Engineer', 'Develop software', 2000
    FROM dbo.departments d WHERE d.name = 'IT';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.positions WHERE name = 'Accountant')
BEGIN
    INSERT dbo.positions (department_id, name, description, base_salary)
    SELECT d.id, 'Accountant', 'Handle finance tasks', 1800
    FROM dbo.departments d WHERE d.name = 'Finance';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.employees WHERE email = 'admin@hrm.local')
BEGIN
    DECLARE @deptId BIGINT = (SELECT TOP 1 id FROM dbo.departments WHERE name = 'HR');
    DECLARE @posId BIGINT = (SELECT TOP 1 id FROM dbo.positions WHERE name = 'HR Manager');
    DECLARE @userId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE username = 'admin');
    INSERT dbo.employees (employee_code, user_id, department_id, position_id, email, fullName, dateOfBirth, phone, address, hire_date, contract_type, salary, department, position)
    VALUES ('EMP001', @userId, @deptId, @posId, 'admin@hrm.local', 'System Admin', '1990-01-01', '0900000000', 'HCMC', '2022-01-01', 'FULL_TIME', 3000, 'HR', 'HR Manager');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.employees WHERE email = 'manager1@hrm.local')
BEGIN
    DECLARE @deptId BIGINT = (SELECT TOP 1 id FROM dbo.departments WHERE name = 'IT');
    DECLARE @posId BIGINT = (SELECT TOP 1 id FROM dbo.positions WHERE name = 'Software Engineer');
    DECLARE @userId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE username = 'manager1');
    INSERT dbo.employees (employee_code, user_id, department_id, position_id, email, fullName, dateOfBirth, phone, address, hire_date, contract_type, salary, department, position)
    VALUES ('EMP002', @userId, @deptId, @posId, 'manager1@hrm.local', 'Dept Manager', '1992-05-12', '0900000001', 'HCMC', '2022-06-01', 'FULL_TIME', 2500, 'IT', 'Software Engineer');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.employees WHERE email = 'employee1@hrm.local')
BEGIN
    DECLARE @deptId BIGINT = (SELECT TOP 1 id FROM dbo.departments WHERE name = 'Finance');
    DECLARE @posId BIGINT = (SELECT TOP 1 id FROM dbo.positions WHERE name = 'Accountant');
    DECLARE @userId BIGINT = (SELECT TOP 1 id FROM dbo.users WHERE username = 'employee1');
    INSERT dbo.employees (employee_code, user_id, department_id, position_id, email, fullName, dateOfBirth, phone, address, hire_date, contract_type, salary, department, position)
    VALUES ('EMP003', @userId, @deptId, @posId, 'employee1@hrm.local', 'Employee One', '1996-11-20', '0900000002', 'HCMC', '2023-01-15', 'FULL_TIME', 1800, 'Finance', 'Accountant');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.work_schedules WHERE name = 'Office Hours')
BEGIN
    INSERT dbo.work_schedules (name, start_time, end_time, days_of_week, description)
    VALUES ('Office Hours', '08:30', '17:30', 'Mon-Fri', 'Standard office schedule');
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.recruitments WHERE title = 'Junior Developer')
BEGIN
    INSERT dbo.recruitments (title, department_id, position_id, openings, status, description)
    SELECT 'Junior Developer', d.id, p.id, 2, 'OPEN', 'Entry-level developer role'
    FROM dbo.departments d
    JOIN dbo.positions p ON p.department_id = d.id AND p.name = 'Software Engineer'
    WHERE d.name = 'IT';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.candidates WHERE email = 'candidate1@hrm.local')
BEGIN
    INSERT dbo.candidates (recruitment_id, full_name, email, phone, status)
    SELECT r.id, 'Candidate One', 'candidate1@hrm.local', '0900000010', 'APPLIED'
    FROM dbo.recruitments r WHERE r.title = 'Junior Developer';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.interviews WHERE candidate_id = (SELECT TOP 1 id FROM dbo.candidates WHERE email = 'candidate1@hrm.local'))
BEGIN
    INSERT dbo.interviews (candidate_id, interviewer_id, scheduled_at, result, notes)
    SELECT c.id, e.id, DATEADD(day, 3, SYSUTCDATETIME()), 'PENDING', 'First round interview'
    FROM dbo.candidates c
    CROSS JOIN dbo.employees e
    WHERE c.email = 'candidate1@hrm.local'
      AND e.email = 'manager1@hrm.local';
END
GO
