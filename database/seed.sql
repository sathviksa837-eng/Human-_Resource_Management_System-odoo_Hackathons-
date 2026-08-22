-- =============================================================================
-- Dayflow HRMS - Backend Database Seed Script
-- =============================================================================

-- Seed Users (Password is 'Secret123!' hashed with SHA-256)
INSERT INTO users (email, password_hash, role, is_verified) VALUES
('alice.hr@dayflow.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'hr', 1),
('bob.smith@dayflow.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'employee', 1),
('charlie.davis@dayflow.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'employee', 1);

-- Seed Employees
INSERT INTO employees (user_id, employee_id, name, email, role, job_title, department, phone, address, basic_salary, allowances, deductions) VALUES
(1, 'EMP-0001', 'Alice Johnson (HR Admin)', 'alice.hr@dayflow.com', 'hr', 'HR Director', 'Human Resources', '+1 (555) 019-2831', '100 Enterprise Way, San Francisco, CA', 8500.0, 1200.0, 700.0),
(2, 'EMP-0002', 'Bob Smith', 'bob.smith@dayflow.com', 'employee', 'Senior Backend Engineer', 'Engineering', '+1 (555) 014-9922', '742 Evergreen Terrace, Springfield', 6500.0, 800.0, 500.0),
(3, 'EMP-0003', 'Charlie Davis', 'charlie.davis@dayflow.com', 'employee', 'Product Designer', 'Design', '+1 (555) 018-3344', '123 Market Street, New York, NY', 5800.0, 600.0, 450.0);

-- Seed Attendance Records
INSERT INTO attendances (employee_id, date, check_in, check_out, worked_hours, status) VALUES
(2, DATE('now'), DATETIME('now', '-8 hours'), DATETIME('now'), 8.0, 'present'),
(3, DATE('now'), DATETIME('now', '-4 hours'), DATETIME('now'), 4.0, 'half_day');

-- Seed Leave Requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, number_of_days, remarks, state) VALUES
(3, 'paid', DATE('now', '+2 days'), DATE('now', '+4 days'), 3, 'Annual family vacation trip.', 'pending');

-- Seed Payroll Statements
INSERT INTO payrolls (employee_id, pay_period, basic_salary, allowances, deductions, net_salary, payment_date, status) VALUES
(2, 'August 2026', 6500.0, 800.0, 500.0, 6800.0, DATE('now'), 'paid'),
(3, 'August 2026', 5800.0, 600.0, 450.0, 5950.0, DATE('now'), 'verified');
