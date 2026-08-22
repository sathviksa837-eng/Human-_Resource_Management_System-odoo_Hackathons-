-- =============================================================================
-- Dayflow HRMS - Native MySQL Database Schema & Stored Procedures
-- "Every workday, perfectly aligned."
-- =============================================================================

CREATE DATABASE IF NOT EXISTS dayflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dayflow_db;

DROP TABLE IF EXISTS payrolls;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Authentication & Access Control)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee', 'hr') NOT NULL DEFAULT 'employee',
    is_verified TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Employees Profile Table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('employee', 'hr') NOT NULL DEFAULT 'employee',
    job_title VARCHAR(100) DEFAULT 'Software Developer',
    department VARCHAR(100) DEFAULT 'Engineering',
    phone VARCHAR(50),
    address TEXT,
    profile_picture_url TEXT,
    basic_salary DECIMAL(10,2) DEFAULT 0.00,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Attendances Table
CREATE TABLE attendances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in DATETIME,
    check_out DATETIME,
    worked_hours DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('present', 'absent', 'half_day', 'leave') DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY uk_emp_date (employee_id, date)
) ENGINE=InnoDB;

-- 4. Leave Requests Table
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type ENUM('paid', 'sick', 'unpaid') NOT NULL DEFAULT 'paid',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days INT NOT NULL,
    remarks TEXT,
    admin_comment TEXT,
    state ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approver_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_appr FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Payroll Statements Table
CREATE TABLE payrolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    pay_period VARCHAR(50) NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0.00,
    deductions DECIMAL(10,2) DEFAULT 0.00,
    net_salary DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('draft', 'verified', 'paid') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Documents Table
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doc_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- MySQL Performance Indexes
CREATE INDEX idx_emp_email ON employees(email);
CREATE INDEX idx_att_date ON attendances(date);
CREATE INDEX idx_leave_state ON leave_requests(state);

-- =============================================================================
-- MySQL Direct Stored Procedures (Eliminating API overhead)
-- =============================================================================

DELIMITER //

-- Procedure: Direct Check-In for Employee
DROP PROCEDURE IF EXISTS sp_check_in//
CREATE PROCEDURE sp_check_in(
    IN p_emp_id INT,
    IN p_check_in_time DATETIME
)
BEGIN
    DECLARE today_date DATE;
    SET today_date = DATE(p_check_in_time);
    
    INSERT INTO attendances (employee_id, date, check_in, status)
    VALUES (p_emp_id, today_date, p_check_in_time, 'present')
    ON DUPLICATE KEY UPDATE check_in = p_check_in_time, status = 'present';
END//

-- Procedure: Direct Check-Out and Worked Hours Computation
DROP PROCEDURE IF EXISTS sp_check_out//
CREATE PROCEDURE sp_check_out(
    IN p_emp_id INT,
    IN p_check_out_time DATETIME
)
BEGIN
    DECLARE today_date DATE;
    DECLARE in_time DATETIME;
    DECLARE hrs DECIMAL(5,2);
    DECLARE att_status VARCHAR(20);
    
    SET today_date = DATE(p_check_out_time);
    
    SELECT check_in INTO in_time FROM attendances WHERE employee_id = p_emp_id AND date = today_date;
    
    IF in_time IS NOT NULL THEN
        SET hrs = ROUND(TIMESTAMPDIFF(SECOND, in_time, p_check_out_time) / 3600.0, 2);
        IF hrs >= 7.0 THEN
            SET att_status = 'present';
        ELSEIF hrs >= 3.5 THEN
            SET att_status = 'half_day';
        ELSE
            SET att_status = 'absent';
        END IF;
        
        UPDATE attendances 
        SET check_out = p_check_out_time, worked_hours = hrs, status = att_status 
        WHERE employee_id = p_emp_id AND date = today_date;
    END IF;
END//

-- Procedure: Direct Leave Approval with Attendance Auto-Population
DROP PROCEDURE IF EXISTS sp_approve_leave//
CREATE PROCEDURE sp_approve_leave(
    IN p_leave_id INT,
    IN p_approver_id INT,
    IN p_comment TEXT
)
BEGIN
    DECLARE emp INT;
    DECLARE s_date DATE;
    DECLARE e_date DATE;
    DECLARE curr DATE;
    
    SELECT employee_id, start_date, end_date INTO emp, s_date, e_date 
    FROM leave_requests WHERE id = p_leave_id;
    
    UPDATE leave_requests 
    SET state = 'approved', admin_comment = p_comment, approver_id = p_approver_id 
    WHERE id = p_leave_id;
    
    SET curr = s_date;
    WHILE curr <= e_date DO
        INSERT INTO attendances (employee_id, date, status)
        VALUES (emp, curr, 'leave')
        ON DUPLICATE KEY UPDATE status = 'leave';
        SET curr = DATE_ADD(curr, INTERVAL 1 DAY);
    END WHILE;
END//

DELIMITER ;
