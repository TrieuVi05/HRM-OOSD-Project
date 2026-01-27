DROP DATABASE IF EXISTS HRM_DB;
CREATE DATABASE HRM_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE HRM_DB;

-- =========================
-- Security & Access Control
-- =========================

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- =========================
-- Core HR Data
-- =========================

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000)
) ENGINE=InnoDB;

CREATE TABLE positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    base_salary DECIMAL(18,2),
    UNIQUE (department_id, name),
    FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB;

CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE,
    user_id BIGINT,
    department_id BIGINT,
    position_id BIGINT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(50),
    address VARCHAR(255),
    hire_date DATE,
    contract_type VARCHAR(50),
    salary DECIMAL(18,2),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',

    -- legacy string fields (optional)
    department VARCHAR(255),
    position VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
) ENGINE=InnoDB;

-- =========================
-- Contracts
-- =========================

CREATE TABLE contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    salary DECIMAL(18,2),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    signed_at DATETIME,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Work Schedules
-- =========================

CREATE TABLE work_schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(100),
    description VARCHAR(1000)
) ENGINE=InnoDB;

-- =========================
-- Attendance & Timesheet
-- =========================

CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    work_date DATE NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
    schedule_id BIGINT,
    notes VARCHAR(1000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (schedule_id) REFERENCES work_schedules(id)
) ENGINE=InnoDB;

CREATE TABLE timesheets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_hours DECIMAL(10,2) DEFAULT 0,
    overtime_hours DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Leave Management
-- =========================

CREATE TABLE leaves (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(100) NOT NULL,
    reason VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by BIGINT,
    approved_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Payroll
-- =========================

CREATE TABLE payroll (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    basic_salary DECIMAL(18,2) DEFAULT 0,
    allowance DECIMAL(18,2) DEFAULT 0,
    bonus DECIMAL(18,2) DEFAULT 0,
    deduction DECIMAL(18,2) DEFAULT 0,
    net_salary DECIMAL(18,2)
        GENERATED ALWAYS AS (basic_salary + allowance + bonus - deduction) STORED,
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Performance Reviews
-- =========================

CREATE TABLE performance_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    reviewer_id BIGINT,
    review_period VARCHAR(100) NOT NULL,
    score DECIMAL(5,2),
    comments VARCHAR(2000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (reviewer_id) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Recruitment
-- =========================

CREATE TABLE recruitments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    department_id BIGINT,
    position_id BIGINT,
    openings INT DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at DATETIME,
    description VARCHAR(2000),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (position_id) REFERENCES positions(id)
) ENGINE=InnoDB;

CREATE TABLE candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruitment_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    resume_url VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruitment_id) REFERENCES recruitments(id)
) ENGINE=InnoDB;

CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    interviewer_id BIGINT,
    scheduled_at DATETIME NOT NULL,
    result VARCHAR(50),
    notes VARCHAR(2000),
    UNIQUE (candidate_id, scheduled_at),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id),
    FOREIGN KEY (interviewer_id) REFERENCES employees(id)
) ENGINE=InnoDB;

-- =========================
-- Indexes
-- =========================

CREATE INDEX ix_user_roles_role_id ON user_roles(role_id);

CREATE INDEX ix_positions_department_id ON positions(department_id);

CREATE INDEX ix_employees_user_id ON employees(user_id);
CREATE INDEX ix_employees_department_id ON employees(department_id);
CREATE INDEX ix_employees_position_id ON employees(position_id);

CREATE INDEX ix_contracts_employee_id ON contracts(employee_id);

CREATE INDEX ix_attendance_employee_work_date ON attendance(employee_id, work_date);
CREATE INDEX ix_attendance_schedule_id ON attendance(schedule_id);

CREATE INDEX ix_timesheets_employee_period ON timesheets(employee_id, period_start, period_end);

CREATE INDEX ix_leaves_employee_status ON leaves(employee_id, status);

CREATE INDEX ix_payroll_employee_period ON payroll(employee_id, period_start, period_end);

CREATE INDEX ix_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX ix_reviews_reviewer ON performance_reviews(reviewer_id);

CREATE INDEX ix_recruitments_department ON recruitments(department_id);
CREATE INDEX ix_recruitments_position ON recruitments(position_id);

CREATE INDEX ix_candidates_recruitment ON candidates(recruitment_id);

CREATE INDEX ix_interviews_candidate ON interviews(candidate_id);
CREATE INDEX ix_interviews_interviewer ON interviews(interviewer_id);

-- =========================
-- Seed Data
-- =========================

INSERT INTO roles (name, description) VALUES
('HR_ADMIN', 'Admin/HR Manager'),
('MANAGER', 'Department Manager'),
('EMPLOYEE', 'Employee');

INSERT INTO users (username, password_hash, email, full_name, phone, status) VALUES
('admin', '{noop}Admin@123', 'admin@hrm.local', 'System Admin', '0900000000', 'ACTIVE'),
('manager1', '{noop}Manager@123', 'manager1@hrm.local', 'Dept Manager', '0900000001', 'ACTIVE'),
('employee1', '{noop}Employee@123', 'employee1@hrm.local', 'Employee One', '0900000002', 'ACTIVE');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r
WHERE (u.username = 'admin' AND r.name = 'HR_ADMIN')
     OR (u.username = 'manager1' AND r.name = 'MANAGER')
     OR (u.username = 'employee1' AND r.name = 'EMPLOYEE');

INSERT INTO departments (name, description) VALUES
('HR', 'Human Resources'),
('IT', 'Information Technology'),
('Finance', 'Finance & Accounting');

INSERT INTO positions (department_id, name, description, base_salary)
SELECT d.id, 'HR Manager', 'Manage HR operations', 2500 FROM departments d WHERE d.name = 'HR';

INSERT INTO positions (department_id, name, description, base_salary)
SELECT d.id, 'Software Engineer', 'Develop software', 2000 FROM departments d WHERE d.name = 'IT';

INSERT INTO positions (department_id, name, description, base_salary)
SELECT d.id, 'Accountant', 'Handle finance tasks', 1800 FROM departments d WHERE d.name = 'Finance';

INSERT INTO employees (employee_code, user_id, department_id, position_id, email, full_name, date_of_birth, phone, address, hire_date, contract_type, salary, department, position)
SELECT 'EMP001', u.id, d.id, p.id, 'admin@hrm.local', 'System Admin', '1990-01-01', '0900000000', 'HCMC', '2022-01-01', 'FULL_TIME', 3000, 'HR', 'HR Manager'
FROM users u
JOIN departments d ON d.name = 'HR'
JOIN positions p ON p.name = 'HR Manager'
WHERE u.username = 'admin';

INSERT INTO employees (employee_code, user_id, department_id, position_id, email, full_name, date_of_birth, phone, address, hire_date, contract_type, salary, department, position)
SELECT 'EMP002', u.id, d.id, p.id, 'manager1@hrm.local', 'Dept Manager', '1992-05-12', '0900000001', 'HCMC', '2022-06-01', 'FULL_TIME', 2500, 'IT', 'Software Engineer'
FROM users u
JOIN departments d ON d.name = 'IT'
JOIN positions p ON p.name = 'Software Engineer'
WHERE u.username = 'manager1';

INSERT INTO employees (employee_code, user_id, department_id, position_id, email, full_name, date_of_birth, phone, address, hire_date, contract_type, salary, department, position)
SELECT 'EMP003', u.id, d.id, p.id, 'employee1@hrm.local', 'Employee One', '1996-11-20', '0900000002', 'HCMC', '2023-01-15', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u
JOIN departments d ON d.name = 'Finance'
JOIN positions p ON p.name = 'Accountant'
WHERE u.username = 'employee1';

INSERT INTO users (username, password_hash, email, full_name, phone, status) VALUES
('employee2', '{noop}Employee@123', 'employee2@hrm.local', 'Employee Two', '0900000102', 'ACTIVE'),
('employee3', '{noop}Employee@123', 'employee3@hrm.local', 'Employee Three', '0900000103', 'ACTIVE'),
('employee4', '{noop}Employee@123', 'employee4@hrm.local', 'Employee Four', '0900000104', 'ACTIVE'),
('employee5', '{noop}Employee@123', 'employee5@hrm.local', 'Employee Five', '0900000105', 'ACTIVE'),
('employee6', '{noop}Employee@123', 'employee6@hrm.local', 'Employee Six', '0900000106', 'ACTIVE'),
('employee7', '{noop}Employee@123', 'employee7@hrm.local', 'Employee Seven', '0900000107', 'ACTIVE'),
('employee8', '{noop}Employee@123', 'employee8@hrm.local', 'Employee Eight', '0900000108', 'ACTIVE'),
('employee9', '{noop}Employee@123', 'employee9@hrm.local', 'Employee Nine', '0900000109', 'ACTIVE'),
('employee10', '{noop}Employee@123', 'employee10@hrm.local', 'Employee Ten', '0900000110', 'ACTIVE'),
('employee11', '{noop}Employee@123', 'employee11@hrm.local', 'Employee Eleven', '0900000111', 'ACTIVE'),
('employee12', '{noop}Employee@123', 'employee12@hrm.local', 'Employee Twelve', '0900000112', 'ACTIVE'),
('employee13', '{noop}Employee@123', 'employee13@hrm.local', 'Employee Thirteen', '0900000113', 'ACTIVE'),
('employee14', '{noop}Employee@123', 'employee14@hrm.local', 'Employee Fourteen', '0900000114', 'ACTIVE'),
('employee15', '{noop}Employee@123', 'employee15@hrm.local', 'Employee Fifteen', '0900000115', 'ACTIVE'),
('employee16', '{noop}Employee@123', 'employee16@hrm.local', 'Employee Sixteen', '0900000116', 'ACTIVE'),
('employee17', '{noop}Employee@123', 'employee17@hrm.local', 'Employee Seventeen', '0900000117', 'ACTIVE'),
('employee18', '{noop}Employee@123', 'employee18@hrm.local', 'Employee Eighteen', '0900000118', 'ACTIVE'),
('employee19', '{noop}Employee@123', 'employee19@hrm.local', 'Employee Nineteen', '0900000119', 'ACTIVE'),
('employee20', '{noop}Employee@123', 'employee20@hrm.local', 'Employee Twenty', '0900000120', 'ACTIVE'),
('employee21', '{noop}Employee@123', 'employee21@hrm.local', 'Employee Twenty One', '0900000121', 'ACTIVE'),
('employee22', '{noop}Employee@123', 'employee22@hrm.local', 'Employee Twenty Two', '0900000122', 'ACTIVE'),
('employee23', '{noop}Employee@123', 'employee23@hrm.local', 'Employee Twenty Three', '0900000123', 'ACTIVE'),
('employee24', '{noop}Employee@123', 'employee24@hrm.local', 'Employee Twenty Four', '0900000124', 'ACTIVE'),
('employee25', '{noop}Employee@123', 'employee25@hrm.local', 'Employee Twenty Five', '0900000125', 'ACTIVE'),
('employee26', '{noop}Employee@123', 'employee26@hrm.local', 'Employee Twenty Six', '0900000126', 'ACTIVE'),
('employee27', '{noop}Employee@123', 'employee27@hrm.local', 'Employee Twenty Seven', '0900000127', 'ACTIVE'),
('employee28', '{noop}Employee@123', 'employee28@hrm.local', 'Employee Twenty Eight', '0900000128', 'ACTIVE'),
('employee29', '{noop}Employee@123', 'employee29@hrm.local', 'Employee Twenty Nine', '0900000129', 'ACTIVE'),
('employee30', '{noop}Employee@123', 'employee30@hrm.local', 'Employee Thirty', '0900000130', 'ACTIVE'),
('employee31', '{noop}Employee@123', 'employee31@hrm.local', 'Employee Thirty One', '0900000131', 'ACTIVE');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r
WHERE r.name = 'EMPLOYEE'
    AND u.username IN (
        'employee2','employee3','employee4','employee5','employee6','employee7','employee8','employee9','employee10','employee11',
        'employee12','employee13','employee14','employee15','employee16','employee17','employee18','employee19','employee20','employee21',
        'employee22','employee23','employee24','employee25','employee26','employee27','employee28','employee29','employee30','employee31'
    );

INSERT INTO employees (employee_code, user_id, department_id, position_id, email, full_name, date_of_birth, phone, address, hire_date, contract_type, salary, department, position)
SELECT 'EMP004', u.id, d.id, p.id, 'employee2@hrm.local', 'Employee Two', '1997-02-02', '0900000102', 'HCMC', '2023-02-01', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee2'
UNION ALL
SELECT 'EMP005', u.id, d.id, p.id, 'employee3@hrm.local', 'Employee Three', '1997-03-03', '0900000103', 'HCMC', '2023-02-02', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee3'
UNION ALL
SELECT 'EMP006', u.id, d.id, p.id, 'employee4@hrm.local', 'Employee Four', '1997-04-04', '0900000104', 'HCMC', '2023-02-03', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee4'
UNION ALL
SELECT 'EMP007', u.id, d.id, p.id, 'employee5@hrm.local', 'Employee Five', '1997-05-05', '0900000105', 'HCMC', '2023-02-04', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee5'
UNION ALL
SELECT 'EMP008', u.id, d.id, p.id, 'employee6@hrm.local', 'Employee Six', '1997-06-06', '0900000106', 'HCMC', '2023-02-05', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee6'
UNION ALL
SELECT 'EMP009', u.id, d.id, p.id, 'employee7@hrm.local', 'Employee Seven', '1997-07-07', '0900000107', 'HCMC', '2023-02-06', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee7'
UNION ALL
SELECT 'EMP010', u.id, d.id, p.id, 'employee8@hrm.local', 'Employee Eight', '1997-08-08', '0900000108', 'HCMC', '2023-02-07', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee8'
UNION ALL
SELECT 'EMP011', u.id, d.id, p.id, 'employee9@hrm.local', 'Employee Nine', '1997-09-09', '0900000109', 'HCMC', '2023-02-08', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee9'
UNION ALL
SELECT 'EMP012', u.id, d.id, p.id, 'employee10@hrm.local', 'Employee Ten', '1997-10-10', '0900000110', 'HCMC', '2023-02-09', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee10'
UNION ALL
SELECT 'EMP013', u.id, d.id, p.id, 'employee11@hrm.local', 'Employee Eleven', '1997-11-11', '0900000111', 'HCMC', '2023-02-10', 'FULL_TIME', 2000, 'IT', 'Software Engineer'
FROM users u JOIN departments d ON d.name = 'IT' JOIN positions p ON p.name = 'Software Engineer' WHERE u.username = 'employee11'
UNION ALL
SELECT 'EMP014', u.id, d.id, p.id, 'employee12@hrm.local', 'Employee Twelve', '1995-12-12', '0900000112', 'HCMC', '2023-03-01', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee12'
UNION ALL
SELECT 'EMP015', u.id, d.id, p.id, 'employee13@hrm.local', 'Employee Thirteen', '1995-01-13', '0900000113', 'HCMC', '2023-03-02', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee13'
UNION ALL
SELECT 'EMP016', u.id, d.id, p.id, 'employee14@hrm.local', 'Employee Fourteen', '1995-02-14', '0900000114', 'HCMC', '2023-03-03', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee14'
UNION ALL
SELECT 'EMP017', u.id, d.id, p.id, 'employee15@hrm.local', 'Employee Fifteen', '1995-03-15', '0900000115', 'HCMC', '2023-03-04', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee15'
UNION ALL
SELECT 'EMP018', u.id, d.id, p.id, 'employee16@hrm.local', 'Employee Sixteen', '1995-04-16', '0900000116', 'HCMC', '2023-03-05', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee16'
UNION ALL
SELECT 'EMP019', u.id, d.id, p.id, 'employee17@hrm.local', 'Employee Seventeen', '1995-05-17', '0900000117', 'HCMC', '2023-03-06', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee17'
UNION ALL
SELECT 'EMP020', u.id, d.id, p.id, 'employee18@hrm.local', 'Employee Eighteen', '1995-06-18', '0900000118', 'HCMC', '2023-03-07', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee18'
UNION ALL
SELECT 'EMP021', u.id, d.id, p.id, 'employee19@hrm.local', 'Employee Nineteen', '1995-07-19', '0900000119', 'HCMC', '2023-03-08', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee19'
UNION ALL
SELECT 'EMP022', u.id, d.id, p.id, 'employee20@hrm.local', 'Employee Twenty', '1995-08-20', '0900000120', 'HCMC', '2023-03-09', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee20'
UNION ALL
SELECT 'EMP023', u.id, d.id, p.id, 'employee21@hrm.local', 'Employee Twenty One', '1995-09-21', '0900000121', 'HCMC', '2023-03-10', 'FULL_TIME', 2200, 'HR', 'HR Manager'
FROM users u JOIN departments d ON d.name = 'HR' JOIN positions p ON p.name = 'HR Manager' WHERE u.username = 'employee21'
UNION ALL
SELECT 'EMP024', u.id, d.id, p.id, 'employee22@hrm.local', 'Employee Twenty Two', '1993-10-22', '0900000122', 'HCMC', '2023-04-01', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee22'
UNION ALL
SELECT 'EMP025', u.id, d.id, p.id, 'employee23@hrm.local', 'Employee Twenty Three', '1993-11-23', '0900000123', 'HCMC', '2023-04-02', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee23'
UNION ALL
SELECT 'EMP026', u.id, d.id, p.id, 'employee24@hrm.local', 'Employee Twenty Four', '1993-12-24', '0900000124', 'HCMC', '2023-04-03', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee24'
UNION ALL
SELECT 'EMP027', u.id, d.id, p.id, 'employee25@hrm.local', 'Employee Twenty Five', '1993-01-25', '0900000125', 'HCMC', '2023-04-04', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee25'
UNION ALL
SELECT 'EMP028', u.id, d.id, p.id, 'employee26@hrm.local', 'Employee Twenty Six', '1993-02-26', '0900000126', 'HCMC', '2023-04-05', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee26'
UNION ALL
SELECT 'EMP029', u.id, d.id, p.id, 'employee27@hrm.local', 'Employee Twenty Seven', '1993-03-27', '0900000127', 'HCMC', '2023-04-06', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee27'
UNION ALL
SELECT 'EMP030', u.id, d.id, p.id, 'employee28@hrm.local', 'Employee Twenty Eight', '1993-04-28', '0900000128', 'HCMC', '2023-04-07', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee28'
UNION ALL
SELECT 'EMP031', u.id, d.id, p.id, 'employee29@hrm.local', 'Employee Twenty Nine', '1993-05-29', '0900000129', 'HCMC', '2023-04-08', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee29'
UNION ALL
SELECT 'EMP032', u.id, d.id, p.id, 'employee30@hrm.local', 'Employee Thirty', '1993-06-30', '0900000130', 'HCMC', '2023-04-09', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee30'
UNION ALL
SELECT 'EMP033', u.id, d.id, p.id, 'employee31@hrm.local', 'Employee Thirty One', '1993-07-31', '0900000131', 'HCMC', '2023-04-10', 'FULL_TIME', 1800, 'Finance', 'Accountant'
FROM users u JOIN departments d ON d.name = 'Finance' JOIN positions p ON p.name = 'Accountant' WHERE u.username = 'employee31';

INSERT INTO work_schedules (name, start_time, end_time, days_of_week, description)
VALUES ('Office Hours', '08:30:00', '17:30:00', 'Mon-Fri', 'Standard office schedule');

INSERT INTO recruitments (title, department_id, position_id, openings, status, description)
SELECT 'Junior Developer', d.id, p.id, 2, 'OPEN', 'Entry-level developer role'
FROM departments d
JOIN positions p ON p.department_id = d.id AND p.name = 'Software Engineer'
WHERE d.name = 'IT';

INSERT INTO candidates (recruitment_id, full_name, email, phone, status)
SELECT r.id, 'Candidate One', 'candidate1@hrm.local', '0900000010', 'APPLIED'
FROM recruitments r WHERE r.title = 'Junior Developer';

INSERT INTO interviews (candidate_id, interviewer_id, scheduled_at, result, notes)
SELECT c.id, e.id, DATE_ADD(NOW(), INTERVAL 3 DAY), 'PENDING', 'First round interview'
FROM candidates c
CROSS JOIN employees e
WHERE c.email = 'candidate1@hrm.local'
    AND e.email = 'manager1@hrm.local';

-- =========================
-- Dev: Update employee full_name to Vietnamese two-word names (no diacritics)
-- =========================
UPDATE employees
SET full_name = CASE employee_code
    WHEN 'EMP001' THEN 'Nguyen An'
    WHEN 'EMP002' THEN 'Tran Binh'
    WHEN 'EMP003' THEN 'Le Hoa'
    WHEN 'EMP004' THEN 'Pham Lan'
    WHEN 'EMP005' THEN 'Hoang Mai'
    WHEN 'EMP006' THEN 'Doan Hung'
    WHEN 'EMP007' THEN 'Bui Son'
    WHEN 'EMP008' THEN 'Vu Khanh'
    WHEN 'EMP009' THEN 'Ly Minh'
    WHEN 'EMP010' THEN 'Dang Huy'
    WHEN 'EMP011' THEN 'Ngo Quoc'
    WHEN 'EMP012' THEN 'Tran Thanh'
    WHEN 'EMP013' THEN 'Le Thi'
    WHEN 'EMP014' THEN 'Pham Duc'
    WHEN 'EMP015' THEN 'Hoang Anh'
    WHEN 'EMP016' THEN 'Doan Nam'
    WHEN 'EMP017' THEN 'Bui Luyen'
    WHEN 'EMP018' THEN 'Vu Long'
    WHEN 'EMP019' THEN 'Ly Dung'
    WHEN 'EMP020' THEN 'Dang Thao'
    WHEN 'EMP021' THEN 'Ngo An'
    WHEN 'EMP022' THEN 'Tran Khoa'
    WHEN 'EMP023' THEN 'Le Quang'
    WHEN 'EMP024' THEN 'Pham Hieu'
    WHEN 'EMP025' THEN 'Hoang Giang'
    WHEN 'EMP026' THEN 'Doan Kiet'
    WHEN 'EMP027' THEN 'Bui Thanh'
    WHEN 'EMP028' THEN 'Vu Phat'
    WHEN 'EMP029' THEN 'Ly Tuan'
    WHEN 'EMP030' THEN 'Dang Minh'
    WHEN 'EMP031' THEN 'Ngo Trung'
    WHEN 'EMP032' THEN 'Tran Son'
    WHEN 'EMP033' THEN 'Le Van'
    ELSE full_name
END
WHERE employee_code IN (
    'EMP001','EMP002','EMP003','EMP004','EMP005','EMP006','EMP007','EMP008','EMP009','EMP010',
    'EMP011','EMP012','EMP013','EMP014','EMP015','EMP016','EMP017','EMP018','EMP019','EMP020',
    'EMP021','EMP022','EMP023','EMP024','EMP025','EMP026','EMP027','EMP028','EMP029','EMP030',
    'EMP031','EMP032','EMP033'
);

-- =========================
-- Dev: Seed attendance - 3 random ABSENT employees per day (2026-01-22 .. 2026-01-28)
-- Inserts only ABSENT rows; PRESENT rows are not added (status defaults to PRESENT if needed).
-- =========================
INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-22', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-23', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-24', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-25', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-26', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-27', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

INSERT INTO attendance (employee_id, work_date, status)
SELECT id, '2026-01-28', 'ABSENT' FROM employees ORDER BY RAND() LIMIT 3;

-- =========================
-- Dev: Seed payroll for January 2026
-- =========================
INSERT INTO payroll (employee_id, period_start, period_end, basic_salary, allowance, bonus, deduction, status)
SELECT id, '2026-01-01', '2026-01-31', COALESCE(salary, 0), 0, 0, 0, 'PAID'
FROM employees;

