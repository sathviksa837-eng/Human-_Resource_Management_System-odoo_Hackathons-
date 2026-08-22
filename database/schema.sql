-- =============================================================================
-- Dayflow HRMS - Backend Database DDL Schema (PostgreSQL / SQLite Compatible)
-- "Every workday, perfectly aligned."
-- =============================================================================

DROP TABLE IF EXISTS payrolls;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Authentication & Access Roles)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('employee', 'hr')),
    is_verified INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Employees Profile Table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('employee', 'hr')),
    job_title VARCHAR(100) DEFAULT 'Software Developer',
    department VARCHAR(100) DEFAULT 'Engineering',
    phone VARCHAR(50),
    address TEXT,
    profile_picture_url TEXT,
    basic_salary REAL DEFAULT 0.0,
    allowances REAL DEFAULT 0.0,
    deductions REAL DEFAULT 0.0,
    net_salary REAL GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Attendances Table
CREATE TABLE attendances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    worked_hours REAL DEFAULT 0.0,
    status VARCHAR(20) NOT NULL CHECK(status IN ('present', 'absent', 'half_day', 'leave')) DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE(employee_id, date)
);

-- 4. Leave Requests Table
CREATE TABLE leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    leave_type VARCHAR(20) NOT NULL CHECK(leave_type IN ('paid', 'sick', 'unpaid')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days INTEGER NOT NULL,
    remarks TEXT,
    admin_comment TEXT,
    state VARCHAR(20) NOT NULL CHECK(state IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approver_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Payroll Statements Table
CREATE TABLE payrolls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    pay_period VARCHAR(50) NOT NULL,
    basic_salary REAL NOT NULL,
    allowances REAL DEFAULT 0.0,
    deductions REAL DEFAULT 0.0,
    net_salary REAL NOT NULL,
    payment_date DATE DEFAULT (DATE('now')),
    status VARCHAR(20) NOT NULL CHECK(status IN ('draft', 'verified', 'paid')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 6. Documents Table
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Database Performance Indexes
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_attendances_emp_date ON attendances(employee_id, date);
CREATE INDEX idx_leave_emp_state ON leave_requests(employee_id, state);
CREATE INDEX idx_payroll_emp ON payrolls(employee_id);
