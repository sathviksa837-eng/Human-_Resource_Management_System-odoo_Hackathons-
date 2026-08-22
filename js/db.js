/* Dayflow HRMS - Relational Database Engine (MySQL Relational Schema Layer) */

const STORAGE_KEYS = {
  USERS: 'dayflow_users',
  HRS: 'dayflow_hrs',
  ATTENDANCE: 'dayflow_attendance',
  LEAVES: 'dayflow_leaves',
  PROJECTS: 'dayflow_projects',
  SESSION: 'dayflow_session'
};

// 4 HR MANAGERS (Relational Schema)
const SEED_HRS = [
  {
    id: 1,
    hrCode: 'HR001',
    name: 'Eleanor Vance',
    email: 'hr.eleanor@dayflow.com',
    password: 'password123',
    department: 'Engineering',
    position: 'Chief Engineering HR Officer',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    hrCode: 'HR002',
    name: 'Marcus Vance',
    email: 'hr.marcus@dayflow.com',
    password: 'password123',
    department: 'Product Design',
    position: 'Head of Design HR',
    phone: '+1 (555) 342-9100',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    hrCode: 'HR003',
    name: 'Sophia Martinez',
    email: 'hr.sophia@dayflow.com',
    password: 'password123',
    department: 'Marketing',
    position: 'Marketing HR Director',
    phone: '+1 (555) 891-2345',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    hrCode: 'HR004',
    name: 'David Kim',
    email: 'hr.david@dayflow.com',
    password: 'password123',
    department: 'Sales & Finance',
    position: 'VP of Sales HR',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

// 28 EMPLOYEES (EXACTLY 7 EMPLOYEES UNDER EACH OF THE 4 HR MANAGERS) + PENDING APPLICANTS
const SEED_USERS = [
  // ------------------------------------------------------------
  // HR MANAGERS (ADMIN PRIVILEGES)
  // ------------------------------------------------------------
  { id: 'OIELVA20210001', hrId: 1, name: 'Eleanor Vance', email: 'hr.eleanor@dayflow.com', password: 'password123', role: 'admin', department: 'Engineering', position: 'Chief Engineering HR Officer', phone: '+1 (555) 019-2834', address: '742 Evergreen Terrace, Springfield, OR', joinDate: '2021-03-15', companyName: 'Odoo India', salary: { basic: 7500, hra: 2500, allowances: 1500, deductions: 800 }, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 20, sick: 10, casual: 7, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIMAVA20210002', hrId: 2, name: 'Marcus Vance', email: 'hr.marcus@dayflow.com', password: 'password123', role: 'admin', department: 'Product Design', position: 'Head of Design HR', phone: '+1 (555) 342-9100', address: '101 Design Blvd, NY', joinDate: '2021-05-10', companyName: 'Odoo India', salary: { basic: 7400, hra: 2400, allowances: 1400, deductions: 750 }, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 20, sick: 10, casual: 7, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OISOMA20220003', hrId: 3, name: 'Sophia Martinez', email: 'hr.sophia@dayflow.com', password: 'password123', role: 'admin', department: 'Marketing', position: 'Marketing HR Director', phone: '+1 (555) 891-2345', address: '45 Market St, SF', joinDate: '2022-01-15', companyName: 'Odoo India', salary: { basic: 7200, hra: 2300, allowances: 1300, deductions: 700 }, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 20, sick: 10, casual: 7, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIDAKI20220004', hrId: 4, name: 'David Kim', email: 'hr.david@dayflow.com', password: 'password123', role: 'admin', department: 'Sales & Finance', position: 'VP of Sales HR', phone: '+1 (555) 456-7890', address: '88 Financial Plaza, Chicago, IL', joinDate: '2022-04-01', companyName: 'Odoo India', salary: { basic: 7600, hra: 2600, allowances: 1600, deductions: 850 }, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 20, sick: 10, casual: 7, unpaid: 0 }, verified: true, status: 'approved' },

  // ------------------------------------------------------------
  // 7 EMPLOYEES UNDER HR 1 (Eleanor Vance - Engineering)
  // ------------------------------------------------------------
  { id: 'OISAJE20220001', hrId: 1, name: 'Sarah Jenkins', email: 'sarah@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Senior Frontend Engineer', phone: '+1 (555) 438-9102', address: '128 Innovation Way, Techville, CA', joinDate: '2022-06-01', companyName: 'Odoo India', salary: { basic: 6200, hra: 2000, allowances: 1200, deductions: 650 }, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIJOH20220002', hrId: 1, name: 'John Doe', email: 'john@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Backend Systems Lead', phone: '+1 (555) 901-2345', address: '12 Tech Park, Austin, TX', joinDate: '2022-08-15', companyName: 'Odoo India', salary: { basic: 6400, hra: 2100, allowances: 1100, deductions: 600 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIEMIL20230003', hrId: 1, name: 'Emily Watson', email: 'emily@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'DevOps Specialist', phone: '+1 (555) 890-1234', address: '54 Cloud Way, Seattle, WA', joinDate: '2023-02-10', companyName: 'Odoo India', salary: { basic: 6000, hra: 1900, allowances: 1000, deductions: 550 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', leaveBalance: { paid: 14, sick: 8, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIMICH20230004', hrId: 1, name: 'Michael Brown', email: 'michael@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Full Stack Developer', phone: '+1 (555) 789-0123', address: '88 Code Street, Boston, MA', joinDate: '2023-05-20', companyName: 'Odoo India', salary: { basic: 5800, hra: 1800, allowances: 950, deductions: 500 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', leaveBalance: { paid: 16, sick: 9, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIPRIY20240005', hrId: 1, name: 'Priya Patel', email: 'priya@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'QA Lead Engineer', phone: '+1 (555) 678-9012', address: '23 Testing Lane, San Jose, CA', joinDate: '2024-01-12', companyName: 'Odoo India', salary: { basic: 5600, hra: 1700, allowances: 900, deductions: 480 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIKEN20240006', hrId: 1, name: 'Kevin Zhao', email: 'kevin@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Cloud Architect', phone: '+1 (555) 567-8901', address: '77 Server Ave, Denver, CO', joinDate: '2024-04-05', companyName: 'Odoo India', salary: { basic: 6500, hra: 2200, allowances: 1300, deductions: 700 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin', leaveBalance: { paid: 18, sick: 10, casual: 6, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIJESS20250007', hrId: 1, name: 'Jessica Taylor', email: 'jessica@dayflow.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Database Administrator', phone: '+1 (555) 456-7890', address: '90 SQL Road, Raleigh, NC', joinDate: '2025-02-01', companyName: 'Odoo India', salary: { basic: 5900, hra: 1850, allowances: 1000, deductions: 520 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', leaveBalance: { paid: 12, sick: 7, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },

  // ------------------------------------------------------------
  // 7 EMPLOYEES UNDER HR 2 (Marcus Vance - Product Design)
  // ------------------------------------------------------------
  { id: 'OIALRI20230001', hrId: 2, name: 'Alex Rivera', email: 'alex@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Lead UX Specialist', phone: '+1 (555) 872-3019', address: '45 Creative Ave, NY', joinDate: '2023-01-10', companyName: 'Odoo India', salary: { basic: 5800, hra: 1800, allowances: 1000, deductions: 550 }, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 18, sick: 10, casual: 6, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OICHL20230002', hrId: 2, name: 'Chloe Bennett', email: 'chloe@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Senior Product Designer', phone: '+1 (555) 234-8901', address: '12 Studio Row, Brooklyn, NY', joinDate: '2023-04-15', companyName: 'Odoo India', salary: { basic: 5700, hra: 1750, allowances: 950, deductions: 520 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe', leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIDAN20230003', hrId: 2, name: 'Daniel Miller', email: 'daniel@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'UI Component Specialist', phone: '+1 (555) 345-9012', address: '99 Canvas St, Portland, OR', joinDate: '2023-09-01', companyName: 'Odoo India', salary: { basic: 5400, hra: 1600, allowances: 850, deductions: 480 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', leaveBalance: { paid: 14, sick: 9, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIHAN20240004', hrId: 2, name: 'Hannah Abbott', email: 'hannah@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Design System Lead', phone: '+1 (555) 456-0123', address: '33 Figma Way, SF, CA', joinDate: '2024-02-18', companyName: 'Odoo India', salary: { basic: 6100, hra: 1950, allowances: 1100, deductions: 580 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah', leaveBalance: { paid: 16, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OILUC20240005', hrId: 2, name: 'Lucas Wright', email: 'lucas@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'UX Researcher', phone: '+1 (555) 567-1234', address: '88 Insight Blvd, Chicago, IL', joinDate: '2024-06-10', companyName: 'Odoo India', salary: { basic: 5300, hra: 1550, allowances: 800, deductions: 450 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIMIA20250006', hrId: 2, name: 'Mia Rodriguez', email: 'mia@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Interaction Designer', phone: '+1 (555) 678-2345', address: '77 Motion Ave, Austin, TX', joinDate: '2025-01-08', companyName: 'Odoo India', salary: { basic: 5200, hra: 1500, allowances: 800, deductions: 430 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia', leaveBalance: { paid: 13, sick: 7, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OINAT20250007', hrId: 2, name: 'Nathan Scott', email: 'nathan@dayflow.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Visual Designer', phone: '+1 (555) 789-3456', address: '14 Graphic St, LA, CA', joinDate: '2025-03-20', companyName: 'Odoo India', salary: { basic: 5100, hra: 1450, allowances: 750, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nathan', leaveBalance: { paid: 14, sick: 9, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },

  // ------------------------------------------------------------
  // 7 EMPLOYEES UNDER HR 3 (Sophia Martinez - Marketing)
  // ------------------------------------------------------------
  { id: 'OIMACH20230001', hrId: 3, name: 'Marcus Chen', email: 'marcus@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Growth Marketing Lead', phone: '+1 (555) 234-5678', address: '89 Market St, SF', joinDate: '2023-08-15', companyName: 'Odoo India', salary: { basic: 5000, hra: 1500, allowances: 800, deductions: 450 }, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', leaveBalance: { paid: 14, sick: 9, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIOLI20230002', hrId: 3, name: 'Olivia Davis', email: 'olivia@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Content Strategist', phone: '+1 (555) 890-4567', address: '22 Editorial Rd, Boston, MA', joinDate: '2023-11-05', companyName: 'Odoo India', salary: { basic: 4900, hra: 1450, allowances: 750, deductions: 420 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIETH20240003', hrId: 3, name: 'Ethan Harris', email: 'ethan@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'SEO Specialist', phone: '+1 (555) 901-5678', address: '66 Rank Way, Miami, FL', joinDate: '2024-03-12', companyName: 'Odoo India', salary: { basic: 4800, hra: 1400, allowances: 700, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIAVA20240004', hrId: 3, name: 'Ava Nelson', email: 'ava@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Brand Manager', phone: '+1 (555) 012-6789', address: '44 Identity Lane, NY', joinDate: '2024-07-01', companyName: 'Odoo India', salary: { basic: 5500, hra: 1700, allowances: 900, deductions: 500 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava', leaveBalance: { paid: 17, sick: 10, casual: 6, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OINOA20240005', hrId: 3, name: 'Noah King', email: 'noah@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Social Media Lead', phone: '+1 (555) 123-7890', address: '15 Viral St, Atlanta, GA', joinDate: '2024-09-15', companyName: 'Odoo India', salary: { basic: 4700, hra: 1350, allowances: 700, deductions: 380 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', leaveBalance: { paid: 13, sick: 8, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIISAB20250006', hrId: 3, name: 'Isabella Lee', email: 'isabella@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Campaign Specialist', phone: '+1 (555) 234-8901', address: '88 Ad Plaza, Chicago, IL', joinDate: '2025-01-20', companyName: 'Odoo India', salary: { basic: 4600, hra: 1300, allowances: 650, deductions: 360 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', leaveBalance: { paid: 14, sick: 9, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OILI20250007', hrId: 3, name: 'Liam Martin', email: 'liam@dayflow.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Digital Marketer', phone: '+1 (555) 345-9012', address: '99 Media Row, Seattle, WA', joinDate: '2025-04-10', companyName: 'Odoo India', salary: { basic: 4500, hra: 1250, allowances: 600, deductions: 350 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },

  // ------------------------------------------------------------
  // 7 EMPLOYEES UNDER HR 4 (David Kim - Sales & Finance)
  // ------------------------------------------------------------
  { id: 'OIWILL20220001', hrId: 4, name: 'William Turner', email: 'william@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Sales Director', phone: '+1 (555) 456-1234', address: '101 Deal St, Dallas, TX', joinDate: '2022-09-01', companyName: 'Odoo India', salary: { basic: 6800, hra: 2300, allowances: 1400, deductions: 750 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William', leaveBalance: { paid: 18, sick: 10, casual: 6, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OISAM20230002', hrId: 4, name: 'Samantha Clark', email: 'samantha@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Account Executive', phone: '+1 (555) 567-2345', address: '55 Revenue Ave, Houston, TX', joinDate: '2023-03-10', companyName: 'Odoo India', salary: { basic: 5600, hra: 1700, allowances: 950, deductions: 500 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha', leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIJAC20230003', hrId: 4, name: 'Jacob Adams', email: 'jacob@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Financial Analyst', phone: '+1 (555) 678-3456', address: '88 Ledger Rd, Charlotte, NC', joinDate: '2023-07-22', companyName: 'Odoo India', salary: { basic: 5800, hra: 1800, allowances: 1000, deductions: 520 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jacob', leaveBalance: { paid: 16, sick: 9, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIEMM20240004', hrId: 4, name: 'Emma Wilson', email: 'emma@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Client Success Manager', phone: '+1 (555) 789-4567', address: '23 Retention St, Phoenix, AZ', joinDate: '2024-01-15', companyName: 'Odoo India', salary: { basic: 5400, hra: 1600, allowances: 850, deductions: 470 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', leaveBalance: { paid: 14, sick: 8, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIBRY20240005', hrId: 4, name: 'Bryan Evans', email: 'bryan@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Enterprise Sales Specialist', phone: '+1 (555) 890-5678', address: '77 Growth Way, Minneapolis, MN', joinDate: '2024-05-08', companyName: 'Odoo India', salary: { basic: 5900, hra: 1850, allowances: 1050, deductions: 530 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bryan', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIANT20250006', hrId: 4, name: 'Anthony White', email: 'anthony@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Billing Coordinator', phone: '+1 (555) 901-6789', address: '44 Invoice Lane, Columbus, OH', joinDate: '2025-02-14', companyName: 'Odoo India', salary: { basic: 4800, hra: 1400, allowances: 700, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anthony', leaveBalance: { paid: 13, sick: 7, casual: 4, unpaid: 0 }, verified: true, status: 'approved' },
  { id: 'OIGRA20250007', hrId: 4, name: 'Grace Hall', email: 'grace@dayflow.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Business Development Rep', phone: '+1 (555) 012-7890', address: '12 Outreach Rd, Salt Lake City, UT', joinDate: '2025-05-01', companyName: 'Odoo India', salary: { basic: 4700, hra: 1350, allowances: 650, deductions: 380 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: true, status: 'approved' },

  // ------------------------------------------------------------
  // SAMPLE PENDING APPLICANTS ASSIGNED TO SPECIFIC HR MANAGERS
  // ------------------------------------------------------------
  { id: 'PENDING-101', hrId: 1, name: 'Rahul Sharma', email: 'rahulsharma@gmail.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Junior Software Engineer', phone: '+91 98765 43210', address: 'Mumbai, MH', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4500, hra: 1500, allowances: 800, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' },
  { id: 'PENDING-102', hrId: 1, name: 'Aisha Patel', email: 'aishapatel@gmail.com', password: 'password123', role: 'employee', department: 'Engineering', position: 'Frontend Developer Applicant', phone: '+91 98111 22233', address: 'Ahmedabad, GJ', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4600, hra: 1500, allowances: 800, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' },
  { id: 'PENDING-201', hrId: 2, name: 'Lavish Shetty', email: 'lavishshetty@gmail.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'UI/UX Associate Applicant', phone: '+91 98123 45678', address: 'Bengaluru, KA', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4800, hra: 1600, allowances: 800, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lavish', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' },
  { id: 'PENDING-202', hrId: 2, name: 'Maya Lin', email: 'mayalin@gmail.com', password: 'password123', role: 'employee', department: 'Product Design', position: 'Graphic Designer Applicant', phone: '+1 (555) 998-7766', address: 'San Francisco, CA', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4700, hra: 1550, allowances: 750, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' },
  { id: 'PENDING-301', hrId: 3, name: 'Carlos Gomez', email: 'carlosgomez@gmail.com', password: 'password123', role: 'employee', department: 'Marketing', position: 'Digital Media Specialist Applicant', phone: '+1 (555) 334-5566', address: 'Austin, TX', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4500, hra: 1400, allowances: 700, deductions: 380 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' },
  { id: 'PENDING-401', hrId: 4, name: 'Nina Rossi', email: 'ninarossi@gmail.com', password: 'password123', role: 'employee', department: 'Sales & Finance', position: 'Sales Executive Applicant', phone: '+1 (555) 667-8899', address: 'Chicago, IL', joinDate: '2026-08-22', companyName: 'Odoo India', salary: { basic: 4800, hra: 1500, allowances: 750, deductions: 400 }, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nina', leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 }, verified: false, status: 'pending', appliedDate: '2026-08-22' }
];

const SEED_ATTENDANCE = [
  { id: 'att-1', userId: 'OISAJE20220001', hrId: 1, date: '2026-08-22', checkIn: '09:02 AM', checkOut: '-', workHours: 'In Progress', status: 'Present' },
  { id: 'att-2', userId: 'OIELVA20210001', hrId: 1, date: '2026-08-22', checkIn: '08:55 AM', checkOut: '-', workHours: 'In Progress', status: 'Present' },
  { id: 'att-3', userId: 'OIALRI20230001', hrId: 2, date: '2026-08-22', checkIn: '09:45 AM', checkOut: '02:00 PM', workHours: '4h 15m', status: 'Half-day' },
  { id: 'att-4', userId: 'OIMACH20230001', hrId: 3, date: '2026-08-22', checkIn: '-', checkOut: '-', workHours: '0h 00m', status: 'Absent' }
];

const SEED_PROJECTS = [
  // HR 1: Engineering Projects (Eleanor Vance)
  {
    id: 'PRJ-2312',
    hrId: 1,
    name: 'Dayflow Core HRMS Engine',
    department: 'Engineering',
    budget: '$45,000',
    status: 'In Progress',
    deadline: '2026-11-30',
    assignedEmployees: ['OISAJE20220001', 'OIMICH20230004', 'OIPRIY20240005']
  },
  {
    id: 'PRJ-0372',
    hrId: 1,
    name: 'Cloud Infrastructure & Kubernetes Migration',
    department: 'Engineering',
    budget: '$62,000',
    status: 'In Progress',
    deadline: '2026-12-15',
    assignedEmployees: ['OIKEN20240006', 'OIJESS20250007']
  },
  {
    id: 'PRJ-2021',
    hrId: 1,
    name: 'AI Attendance & Facial Recognition Engine',
    department: 'Engineering',
    budget: '$38,500',
    status: 'Completed',
    deadline: '2026-07-20',
    assignedEmployees: ['OISAJE20220001', 'OIKEN20240006']
  },
  {
    id: 'PRJ-4890',
    hrId: 1,
    name: 'Automated Payroll & Tax Compliance Service',
    department: 'Engineering',
    budget: '$29,000',
    status: 'Upcoming',
    deadline: '2027-02-10',
    assignedEmployees: ['OIMICH20230004', 'OIPRIY20240005']
  },

  // HR 2: Product Design Projects (Marcus Vance)
  {
    id: 'PRJ-1092',
    hrId: 2,
    name: 'Next-Gen Mobile App UI/UX Redesign',
    department: 'Product Design',
    budget: '$32,000',
    status: 'In Progress',
    deadline: '2026-10-15',
    assignedEmployees: ['OIALRI20230001', 'OICHL20230002', 'OIDAN20230003']
  },
  {
    id: 'PRJ-5412',
    hrId: 2,
    name: 'Design System & Component Library v3.0',
    department: 'Product Design',
    budget: '$28,000',
    status: 'Completed',
    deadline: '2026-06-30',
    assignedEmployees: ['OIHAN20240004', 'OILUC20240005']
  },
  {
    id: 'PRJ-8821',
    hrId: 2,
    name: 'User Experience Research & Accessibility Audit',
    department: 'Product Design',
    budget: '$19,500',
    status: 'In Progress',
    deadline: '2026-09-25',
    assignedEmployees: ['OIMIA20250006', 'OINAT20250007']
  },

  // HR 3: Marketing Projects (Sophia Martinez)
  {
    id: 'PRJ-3301',
    hrId: 3,
    name: 'Q3 Global Brand Campaign & Video Assets',
    department: 'Marketing',
    budget: '$55,000',
    status: 'In Progress',
    deadline: '2026-10-31',
    assignedEmployees: ['OIMACH20230001', 'OIAVA20240004', 'OIISAB20250006']
  },
  {
    id: 'PRJ-7712',
    hrId: 3,
    name: 'SEO & Organic Growth Acceleration',
    department: 'Marketing',
    budget: '$22,000',
    status: 'Completed',
    deadline: '2026-08-01',
    assignedEmployees: ['OIETH20240003', 'OIOLI20230002']
  },

  // HR 4: Sales & Finance Projects (David Kim)
  {
    id: 'PRJ-9904',
    hrId: 4,
    name: 'Enterprise Client Acquisition Strategy',
    department: 'Sales & Finance',
    budget: '$75,000',
    status: 'In Progress',
    deadline: '2026-11-15',
    assignedEmployees: ['OIWILL20220001', 'OISAM20230002', 'OIBRY20240005']
  },
  {
    id: 'PRJ-4410',
    hrId: 4,
    name: 'Financial Ledger & Automated Invoicing System',
    department: 'Sales & Finance',
    budget: '$41,000',
    status: 'In Progress',
    deadline: '2026-12-01',
    assignedEmployees: ['OIJAC20230003', 'OIANT20250006']
  }
];

const SEED_LEAVES = [
  { id: 'lv-101', userId: 'OISAJE20220001', hrId: 1, leaveType: 'Paid Leave', startDate: '2026-08-25', endDate: '2026-08-27', reason: 'Attending Developer Conference', status: 'Approved', appliedOn: '2026-08-20' },
  { id: 'lv-102', userId: 'OIALRI20230001', hrId: 2, leaveType: 'Sick Leave', startDate: '2026-08-28', endDate: '2026-08-29', reason: 'Dental appointment', status: 'Pending', appliedOn: '2026-08-21' }
];

// Helper: Auto-Generate Employee ID format [OI][First2_FirstName][First2_LastName][Year][Serial]
export function generateEmployeeID(name, joinDate, existingUsers = []) {
  const nameParts = name.trim().split(' ');
  const firstTwo = nameParts[0].substring(0, 2).toUpperCase();
  const lastTwo = (nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0]).substring(0, 2).toUpperCase();
  const year = joinDate ? new Date(joinDate).getFullYear() : new Date().getFullYear();

  const count = existingUsers.filter(u => u.status === 'approved' || u.verified).length + 1;
  const serial = String(count).padStart(4, '0');

  return `OI${firstTwo}${lastTwo}${year}${serial}`;
}

// Helper: Calculate Pro-Rated Salary based on Attendance Formula: Salary * (Days Present / Total Days in Month)
export function calculateProRatedSalary(emp, year = 2026, month = 8) {
  const sal = emp.salary || { monthWage: 50000, basic: 25000, hra: 12500, allowances: 12500, deductions: 500 };
  const baseMonthlyWage = sal.monthWage || (sal.basic + sal.hra + sal.allowances) || 50000;

  // Days in target month (Default 31 days for August)
  const totalDaysInMonth = new Date(year, month, 0).getDate() || 31;

  // Retrieve attendance records for employee in current month
  const allUsers = JSON.parse(localStorage.getItem('dayflow_users') || '[]');
  const allAtt = JSON.parse(localStorage.getItem('dayflow_attendance') || '[]');
  const userAtt = allAtt.filter(a => a.userId && a.userId.toLowerCase() === emp.id.toLowerCase());

  // Count explicit absences
  const explicitAbsences = userAtt.filter(a => a.status === 'Absent').length;

  // Count explicit half-days
  const halfDays = userAtt.filter(a => a.status === 'Half-day').length;

  // Calculate Effective Days Present
  let effectivePresentDays = totalDaysInMonth - explicitAbsences - (halfDays * 0.5);
  if (effectivePresentDays < 0) effectivePresentDays = 0;

  // Present Ratio (Days Present / Total Days in Month)
  const attendanceRatio = effectivePresentDays / totalDaysInMonth;

  // Pro-Rated Base Salary = Salary * (Days Present / Total Days in Month)
  const proRatedGross = baseMonthlyWage * attendanceRatio;
  const absenceDeduction = baseMonthlyWage - proRatedGross;
  const fixedDeductions = sal.deductions || 500;
  const finalNetSalary = Math.max(0, proRatedGross - fixedDeductions);

  return {
    baseMonthlyWage,
    totalDaysInMonth,
    effectivePresentDays,
    absentDays: totalDaysInMonth - effectivePresentDays,
    attendanceRatio,
    proRatedGross,
    absenceDeduction,
    fixedDeductions,
    finalNetSalary
  };
}

export class DB {
  constructor() {
    this.init();
  }

  init() {
    const existing = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existing || !existing.includes('HR001')) {
      localStorage.setItem(STORAGE_KEYS.HRS, JSON.stringify(SEED_HRS));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(SEED_ATTENDANCE));
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(SEED_LEAVES));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    }
  }

  // Projects Methods
  getProjects() {
    let projs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || 'null');
    if (!projs) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
      projs = SEED_PROJECTS;
    }
    return projs;
  }

  getHRProjects(hrId) {
    if (!hrId) return this.getProjects();
    return this.getProjects().filter(p => Number(p.hrId) === Number(hrId));
  }

  addProject(project) {
    const projs = this.getProjects();
    projs.unshift(project);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projs));
  }

  updateProject(project) {
    const projs = this.getProjects();
    const idx = projs.findIndex(p => p.id === project.id);
    if (idx >= 0) {
      projs[idx] = project;
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projs));
    }
  }

  assignEmployeeToProject(projectId, userId) {
    const projs = this.getProjects();
    const proj = projs.find(p => p.id === projectId);
    if (proj) {
      if (!proj.assignedEmployees) proj.assignedEmployees = [];
      if (!proj.assignedEmployees.includes(userId)) {
        proj.assignedEmployees.push(userId);
        this.updateProject(proj);
      }
    }
  }

  removeEmployeeFromProject(projectId, userId) {
    const projs = this.getProjects();
    const proj = projs.find(p => p.id === projectId);
    if (proj && proj.assignedEmployees) {
      proj.assignedEmployees = proj.assignedEmployees.filter(id => id !== userId);
      this.updateProject(proj);
    }
  }

  // HR Managers Methods
  getHRs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HRS) || '[]');
  }

  getHRById(hrId) {
    return this.getHRs().find(h => Number(h.id) === Number(hrId));
  }

  // Users & Employees Methods
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getApprovedUsers(hrId = null) {
    const users = this.getUsers().filter(u => u.status === 'approved' || (u.verified !== false && u.status !== 'pending'));
    if (hrId) {
      return users.filter(u => Number(u.hrId) === Number(hrId));
    }
    return users;
  }

  getPendingUsers(hrId = null) {
    const users = this.getUsers().filter(u => u.status === 'pending' || u.verified === false);
    if (hrId) {
      return users.filter(u => Number(u.hrId) === Number(hrId));
    }
    return users;
  }

  approveUser(emailOrId) {
    const users = this.getUsers();
    const target = emailOrId.toLowerCase();
    const user = users.find(u => (u.email.toLowerCase() === target || u.id.toLowerCase() === target));
    if (!user) throw new Error('Applicant not found in database.');

    const approvedUsers = users.filter(u => u.status === 'approved' || u.verified);
    const generatedId = generateEmployeeID(user.name, user.joinDate || new Date().toISOString(), approvedUsers);

    user.id = generatedId;
    user.verified = true;
    user.status = 'approved';

    this.saveUser(user);
    return user;
  }

  rejectUser(emailOrId) {
    const target = emailOrId.toLowerCase();
    const users = this.getUsers().filter(u => u.email.toLowerCase() !== target && u.id.toLowerCase() !== target);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getUserById(id) {
    if (!id) return null;
    return this.getUsers().find(u => u.id.toLowerCase() === id.toLowerCase());
  }

  getUserByEmail(email) {
    if (!email) return null;
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id.toLowerCase() === user.id.toLowerCase() || (u.email && u.email.toLowerCase() === user.email.toLowerCase()));
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentSession = this.getSession();
    if (currentSession && currentSession.id.toLowerCase() === user.id.toLowerCase()) {
      this.setSession(user);
    }
  }

  deleteUser(id) {
    if (!id) return;
    const targetId = id.toLowerCase();
    const users = this.getUsers().filter(u => u.id.toLowerCase() !== targetId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const attendance = this.getAttendance().filter(a => a.userId.toLowerCase() !== targetId);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));

    const leaves = this.getLeaves().filter(l => l.userId.toLowerCase() !== targetId);
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }

  // Session Methods
  getSession() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || 'null');
  }

  setSession(user) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }

  // Attendance Methods
  getAttendance() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  }

  getUserAttendance(userId) {
    if (!userId) return [];
    return this.getAttendance().filter(a => a.userId && a.userId.toLowerCase() === userId.toLowerCase());
  }

  addAttendanceRecord(record) {
    const records = this.getAttendance();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }

  updateAttendanceRecord(record) {
    const records = this.getAttendance();
    const idx = records.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      records[idx] = record;
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    }
  }

  // Leave Methods
  getLeaves() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES) || '[]');
  }

  getUserLeaves(userId) {
    if (!userId) return [];
    return this.getLeaves().filter(l => l.userId && l.userId.toLowerCase() === userId.toLowerCase());
  }

  addLeave(record) {
    this.addLeaveRecord(record);
  }

  addLeaveRecord(record) {
    const records = this.getLeaves();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(records));
  }

  updateLeaveStatus(id, status, comments = '') {
    const records = this.getLeaves();
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) {
      records[idx].status = status;
      records[idx].comments = comments;
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(records));
    }
  }

  updateLeaveRecord(record) {
    const records = this.getLeaves();
    const idx = records.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      records[idx] = record;
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(records));
    }
  }
}

export const db = new DB();
