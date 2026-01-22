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
