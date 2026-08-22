-- ============================================================
-- Dayflow HRMS - MySQL Relational Database Schema & Seed Data
-- 4 HR Managers & 7 Employees under each HR (28 Employees Total)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `dayflow_hrms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dayflow_hrms`;

-- ------------------------------------------------------------
-- Table Structure for HR Managers (`hrs`)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `hrs`;
CREATE TABLE `hrs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hr_code` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `position` VARCHAR(100) DEFAULT 'HR Manager & Admin',
  `phone` VARCHAR(30) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table Structure for Employees (`employees`)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_code` VARCHAR(30) NOT NULL UNIQUE,
  `hr_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'employee') DEFAULT 'employee',
  `department` VARCHAR(100) NOT NULL,
  `position` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `join_date` DATE DEFAULT NULL,
  `company_name` VARCHAR(100) DEFAULT 'Odoo India',
  `salary_basic` DECIMAL(10,2) DEFAULT 5000.00,
  `salary_hra` DECIMAL(10,2) DEFAULT 1500.00,
  `salary_allowances` DECIMAL(10,2) DEFAULT 800.00,
  `salary_deductions` DECIMAL(10,2) DEFAULT 400.00,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
  `verified` TINYINT(1) DEFAULT 0,
  `applied_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hr_id`) REFERENCES `hrs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table Structure for Attendance (`attendance`)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_code` VARCHAR(30) NOT NULL,
  `hr_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `check_in` VARCHAR(20) DEFAULT '-',
  `check_out` VARCHAR(20) DEFAULT '-',
  `work_hours` VARCHAR(20) DEFAULT '0h 00m',
  `status` ENUM('Present', 'Absent', 'Half-day', 'On Leave') DEFAULT 'Present',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hr_id`) REFERENCES `hrs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table Structure for Leave Applications (`leaves`)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `leaves`;
CREATE TABLE `leaves` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_code` VARCHAR(30) NOT NULL,
  `hr_id` INT NOT NULL,
  `leave_type` VARCHAR(50) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `reason` TEXT DEFAULT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  `applied_on` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`hr_id`) REFERENCES `hrs`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA: 4 HR MANAGERS
-- ============================================================
INSERT INTO `hrs` (`id`, `hr_code`, `name`, `email`, `password`, `department`, `position`, `phone`, `avatar`) VALUES
(1, 'HR001', 'Eleanor Vance', 'hr.eleanor@dayflow.com', 'password123', 'Engineering', 'Chief Engineering HR Officer', '+1 (555) 019-2834', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
(2, 'HR002', 'Marcus Vance', 'hr.marcus@dayflow.com', 'password123', 'Product Design', 'Head of Design HR', '+1 (555) 342-9100', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'),
(3, 'HR003', 'Sophia Martinez', 'hr.sophia@dayflow.com', 'password123', 'Marketing', 'Marketing HR Director', '+1 (555) 891-2345', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
(4, 'HR004', 'David Kim', 'hr.david@dayflow.com', 'password123', 'Sales & Finance', 'VP of Sales HR', '+1 (555) 456-7890', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80');

-- Also seed HR accounts in employees table as admins for unified auth
INSERT INTO `employees` (`id`, `employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`) VALUES
(1, 'OIELVA20210001', 1, 'Eleanor Vance', 'hr.eleanor@dayflow.com', 'password123', 'admin', 'Engineering', 'Chief Engineering HR Officer', '+1 (555) 019-2834', '742 Evergreen Terrace, Springfield, OR', '2021-03-15', 7500, 2500, 1500, 800, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'approved', 1),
(2, 'OIMAVA20210002', 2, 'Marcus Vance', 'hr.marcus@dayflow.com', 'password123', 'admin', 'Product Design', 'Head of Design HR', '+1 (555) 342-9100', '101 Design Blvd, NY', '2021-05-10', 7400, 2400, 1400, 750, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', 'approved', 1),
(3, 'OISOMA20220003', 3, 'Sophia Martinez', 'hr.sophia@dayflow.com', 'password123', 'admin', 'Marketing', 'Marketing HR Director', '+1 (555) 891-2345', '45 Market St, SF', '2022-01-15', 7200, 2300, 1300, 700, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'approved', 1),
(4, 'OIDAKI20220004', 4, 'David Kim', 'hr.david@dayflow.com', 'password123', 'admin', 'Sales & Finance', 'VP of Sales HR', '+1 (555) 456-7890', '88 Financial Plaza, Chicago, IL', '2022-04-01', 7600, 2600, 1600, 850, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'approved', 1);

-- ============================================================
-- SEED DATA: 7 EMPLOYEES UNDER HR 1 (Eleanor Vance - Engineering)
-- ============================================================
INSERT INTO `employees` (`employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`) VALUES
('OISAJE20220001', 1, 'Sarah Jenkins', 'sarah@dayflow.com', 'password123', 'employee', 'Engineering', 'Senior Frontend Engineer', '+1 (555) 438-9102', '128 Innovation Way, Techville, CA', '2022-06-01', 6200, 2000, 1200, 650, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'approved', 1),
('OIJOH20220002', 1, 'John Doe', 'john@dayflow.com', 'password123', 'employee', 'Engineering', 'Backend Systems Lead', '+1 (555) 901-2345', '12 Tech Park, Austin, TX', '2022-08-15', 6400, 2100, 1100, 600, 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe', 'approved', 1),
('OIEMIL20230003', 1, 'Emily Watson', 'emily@dayflow.com', 'password123', 'employee', 'Engineering', 'DevOps Specialist', '+1 (555) 890-1234', '54 Cloud Way, Seattle, WA', '2023-02-10', 6000, 1900, 1000, 550, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', 'approved', 1),
('OIMICH20230004', 1, 'Michael Brown', 'michael@dayflow.com', 'password123', 'employee', 'Engineering', 'Full Stack Developer', '+1 (555) 789-0123', '88 Code Street, Boston, MA', '2023-05-20', 5800, 1800, 950, 500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', 'approved', 1),
('OIPRIY20240005', 1, 'Priya Patel', 'priya@dayflow.com', 'password123', 'employee', 'Engineering', 'QA Lead Engineer', '+1 (555) 678-9012', '23 Testing Lane, San Jose, CA', '2024-01-12', 5600, 1700, 900, 480, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', 'approved', 1),
('OIKEN20240006', 1, 'Kevin Zhao', 'kevin@dayflow.com', 'password123', 'employee', 'Engineering', 'Cloud Architect', '+1 (555) 567-8901', '77 Server Ave, Denver, CO', '2024-04-05', 6500, 2200, 1300, 700, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin', 'approved', 1),
('OIJESS20250007', 1, 'Jessica Taylor', 'jessica@dayflow.com', 'password123', 'employee', 'Engineering', 'Database Administrator', '+1 (555) 456-7890', '90 SQL Road, Raleigh, NC', '2025-02-01', 5900, 1850, 1000, 520, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', 'approved', 1);

-- ============================================================
-- SEED DATA: 7 EMPLOYEES UNDER HR 2 (Marcus Vance - Product Design)
-- ============================================================
INSERT INTO `employees` (`employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`) VALUES
('OIALRI20230001', 2, 'Alex Rivera', 'alex@dayflow.com', 'password123', 'employee', 'Product Design', 'Lead UX Specialist', '+1 (555) 872-3019', '45 Creative Ave, NY', '2023-01-10', 5800, 1800, 1000, 550, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'approved', 1),
('OICHL20230002', 2, 'Chloe Bennett', 'chloe@dayflow.com', 'password123', 'employee', 'Product Design', 'Senior Product Designer', '+1 (555) 234-8901', '12 Studio Row, Brooklyn, NY', '2023-04-15', 5700, 1750, 950, 520, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', 'approved', 1),
('OIDAN20230003', 2, 'Daniel Miller', 'daniel@dayflow.com', 'password123', 'employee', 'Product Design', 'UI Component Specialist', '+1 (555) 345-9012', '99 Canvas St, Portland, OR', '2023-09-01', 5400, 1600, 850, 480, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', 'approved', 1),
('OIHAN20240004', 2, 'Hannah Abbott', 'hannah@dayflow.com', 'password123', 'employee', 'Product Design', 'Design System Lead', '+1 (555) 456-0123', '33 Figma Way, San Francisco, CA', '2024-02-18', 6100, 1950, 1100, 580, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah', 'approved', 1),
('OILUC20240005', 2, 'Lucas Wright', 'lucas@dayflow.com', 'password123', 'employee', 'Product Design', 'UX Researcher', '+1 (555) 567-1234', '88 Insight Blvd, Chicago, IL', '2024-06-10', 5300, 1550, 800, 450, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', 'approved', 1),
('OIMIA20250006', 2, 'Mia Rodriguez', 'mia@dayflow.com', 'password123', 'employee', 'Product Design', 'Interaction Designer', '+1 (555) 678-2345', '77 Motion Ave, Austin, TX', '2025-01-08', 5200, 1500, 800, 430, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', 'approved', 1),
('OINAT20250007', 2, 'Nathan Scott', 'nathan@dayflow.com', 'password123', 'employee', 'Product Design', 'Visual Designer', '+1 (555) 789-3456', '14 Graphic St, Los Angeles, CA', '2025-03-20', 5100, 1450, 750, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan', 'approved', 1);

-- ============================================================
-- SEED DATA: 7 EMPLOYEES UNDER HR 3 (Sophia Martinez - Marketing)
-- ============================================================
INSERT INTO `employees` (`employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`) VALUES
('OIMACH20230001', 3, 'Marcus Chen', 'marcus@dayflow.com', 'password123', 'employee', 'Marketing', 'Growth Marketing Lead', '+1 (555) 234-5678', '89 Market St, SF', '2023-08-15', 5000, 1500, 800, 450, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'approved', 1),
('OIOLI20230002', 3, 'Olivia Davis', 'olivia@dayflow.com', 'password123', 'employee', 'Marketing', 'Content Strategist', '+1 (555) 890-4567', '22 Editorial Rd, Boston, MA', '2023-11-05', 4900, 1450, 750, 420, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', 'approved', 1),
('OIETH20240003', 3, 'Ethan Harris', 'ethan@dayflow.com', 'password123', 'employee', 'Marketing', 'SEO Specialist', '+1 (555) 901-5678', '66 Rank Way, Miami, FL', '2024-03-12', 4800, 1400, 700, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', 'approved', 1),
('OIAVA20240004', 3, 'Ava Nelson', 'ava@dayflow.com', 'password123', 'employee', 'Marketing', 'Brand Manager', '+1 (555) 012-6789', '44 Identity Lane, New York, NY', '2024-07-01', 5500, 1700, 900, 500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava', 'approved', 1),
('OINOA20240005', 3, 'Noah King', 'noah@dayflow.com', 'password123', 'employee', 'Marketing', 'Social Media Lead', '+1 (555) 123-7890', '15 Viral St, Atlanta, GA', '2024-09-15', 4700, 1350, 700, 380, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', 'approved', 1),
('OIISAB20250006', 3, 'Isabella Lee', 'isabella@dayflow.com', 'password123', 'employee', 'Marketing', 'Campaign Specialist', '+1 (555) 234-8901', '88 Ad Plaza, Chicago, IL', '2025-01-20', 4600, 1300, 650, 360, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', 'approved', 1),
('OILI20250007', 3, 'Liam Martin', 'liam@dayflow.com', 'password123', 'employee', 'Marketing', 'Digital Marketer', '+1 (555) 345-9012', '99 Media Row, Seattle, WA', '2025-04-10', 4500, 1250, 600, 350, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam', 'approved', 1);

-- ============================================================
-- SEED DATA: 7 EMPLOYEES UNDER HR 4 (David Kim - Sales & Finance)
-- ============================================================
INSERT INTO `employees` (`employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`) VALUES
('OIWILL20220001', 4, 'William Turner', 'william@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Sales Director', '+1 (555) 456-1234', '101 Deal St, Dallas, TX', '2022-09-01', 6800, 2300, 1400, 750, 'https://api.dicebear.com/7.x/avataaars/svg?seed=William', 'approved', 1),
('OISAM20230002', 4, 'Samantha Clark', 'samantha@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Account Executive', '+1 (555) 567-2345', '55 Revenue Ave, Houston, TX', '2023-03-10', 5600, 1700, 950, 500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha', 'approved', 1),
('OIJAC20230003', 4, 'Jacob Adams', 'jacob@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Financial Analyst', '+1 (555) 678-3456', '88 Ledger Rd, Charlotte, NC', '2023-07-22', 5800, 1800, 1000, 520, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob', 'approved', 1),
('OIEMM20240004', 4, 'Emma Wilson', 'emma@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Client Success Manager', '+1 (555) 789-4567', '23 Retention St, Phoenix, AZ', '2024-01-15', 5400, 1600, 850, 470, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', 'approved', 1),
('OIBRY20240005', 4, 'Bryan Evans', 'bryan@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Enterprise Sales Specialist', '+1 (555) 890-5678', '77 Growth Way, Minneapolis, MN', '2024-05-08', 5900, 1850, 1050, 530, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bryan', 'approved', 1),
('OIANT20250006', 4, 'Anthony White', 'anthony@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Billing Coordinator', '+1 (555) 901-6789', '44 Invoice Lane, Columbus, OH', '2025-02-14', 4800, 1400, 700, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anthony', 'approved', 1),
('OIGRA20250007', 4, 'Grace Hall', 'grace@dayflow.com', 'password123', 'employee', 'Sales & Finance', 'Business Development Rep', '+1 (555) 012-7890', '12 Outreach Rd, Salt Lake City, UT', '2025-05-01', 4700, 1350, 650, 380, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', 'approved', 1);

-- ============================================================
-- SEED DATA: SAMPLE PENDING APPLICANTS FOR EACH HR
-- ============================================================
INSERT INTO `employees` (`employee_code`, `hr_id`, `name`, `email`, `password`, `role`, `department`, `position`, `phone`, `address`, `join_date`, `salary_basic`, `salary_hra`, `salary_allowances`, `salary_deductions`, `avatar`, `status`, `verified`, `applied_date`) VALUES
('PENDING-101', 1, 'Rahul Sharma', 'rahulsharma@gmail.com', 'password123', 'employee', 'Engineering', 'Junior Software Engineer', '+91 98765 43210', 'Mumbai, MH', '2026-08-22', 4500, 1500, 800, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', 'pending', 0, '2026-08-22'),
('PENDING-102', 1, 'Aisha Patel', 'aishapatel@gmail.com', 'password123', 'employee', 'Engineering', 'Frontend Developer Applicant', '+91 98111 22233', 'Ahmedabad, GJ', '2026-08-22', 4600, 1500, 800, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', 'pending', 0, '2026-08-22'),
('PENDING-201', 2, 'Lavish Shetty', 'lavishshetty@gmail.com', 'password123', 'employee', 'Product Design', 'UI/UX Associate Applicant', '+91 98123 45678', 'Bengaluru, KA', '2026-08-22', 4800, 1600, 800, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lavish', 'pending', 0, '2026-08-22'),
('PENDING-202', 2, 'Maya Lin', 'mayalin@gmail.com', 'password123', 'employee', 'Product Design', 'Graphic Designer Applicant', '+1 (555) 998-7766', 'San Francisco, CA', '2026-08-22', 4700, 1550, 750, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', 'pending', 0, '2026-08-22'),
('PENDING-301', 3, 'Carlos Gomez', 'carlosgomez@gmail.com', 'password123', 'employee', 'Marketing', 'Digital Media Specialist Applicant', '+1 (555) 334-5566', 'Austin, TX', '2026-08-22', 4500, 1400, 700, 380, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', 'pending', 0, '2026-08-22'),
('PENDING-401', 4, 'Nina Rossi', 'ninarossi@gmail.com', 'password123', 'employee', 'Sales & Finance', 'Sales Executive Applicant', '+1 (555) 667-8899', 'Chicago, IL', '2026-08-22', 4800, 1500, 750, 400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina', 'pending', 0, '2026-08-22');

-- ============================================================
-- SEED DATA: ATTENDANCE RECORDS FOR EMPLOYEES
-- ============================================================
INSERT INTO `attendance` (`employee_code`, `hr_id`, `date`, `check_in`, `check_out`, `work_hours`, `status`) VALUES
('OISAJE20220001', 1, '2026-08-22', '09:02 AM', '-', 'In Progress', 'Present'),
('OIELVA20210001', 1, '2026-08-22', '08:55 AM', '-', 'In Progress', 'Present'),
('OIJOH20220002', 1, '2026-08-22', '09:15 AM', '-', 'In Progress', 'Present'),
('OIALRI20230001', 2, '2026-08-22', '09:45 AM', '02:00 PM', '4h 15m', 'Half-day'),
('OICHL20230002', 2, '2026-08-22', '08:48 AM', '-', 'In Progress', 'Present'),
('OIMACH20230001', 3, '2026-08-22', '-', '-', '0h 00m', 'Absent'),
('OIWILL20220001', 4, '2026-08-22', '09:00 AM', '-', 'In Progress', 'Present');
