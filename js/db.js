/* Dayflow HRMS - Database & LocalStorage Data Engine */

const STORAGE_KEYS = {
  USERS: 'dayflow_users',
  ATTENDANCE: 'dayflow_attendance',
  LEAVES: 'dayflow_leaves',
  SESSION: 'dayflow_session',
  NOTIFICATIONS: 'dayflow_notifications'
};

// Auto-Generator Function for Employee ID: [OI][First2_FirstName][First2_LastName][Year][4digit_Serial]
// Example: John Doe (Joined 2026) -> OIJODO20260001
export function generateEmployeeID(fullName, joinDateStr = null, existingUsers = []) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'JO';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : 'DO';

  const fn2 = (firstName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();
  const ln2 = (lastName.substring(0, 2) + 'XX').substring(0, 2).toUpperCase();

  const year = joinDateStr ? new Date(joinDateStr).getFullYear() : new Date().getFullYear();

  const prefix = `OI${fn2}${ln2}${year}`;

  // Find highest serial for this year in database
  let maxSerial = 0;
  existingUsers.forEach(u => {
    if (u.id && u.id.startsWith(`OI`)) {
      const match = u.id.match(/^OI[A-Z]{4}(\d{4})(\d{4})$/);
      if (match) {
        const uYear = parseInt(match[1], 10);
        const uSerial = parseInt(match[2], 10);
        if (uYear === year && uSerial > maxSerial) {
          maxSerial = uSerial;
        }
      }
    }
  });

  const nextSerial = String(maxSerial + 1).padStart(4, '0');
  return `${prefix}${nextSerial}`;
}

// Initial Seed Data with strict OIJODO20220001 ID format
const SEED_USERS = [
  {
    id: 'OIELVA20210001',
    name: 'Eleanor Vance',
    email: 'admin@dayflow.com',
    password: 'password123',
    role: 'admin',
    department: 'Human Resources',
    position: 'Chief HR Officer & Admin',
    phone: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace, Springfield, OR',
    joinDate: '2021-03-15',
    companyName: 'Odoo India',
    salary: { basic: 7500, hra: 2500, allowances: 1500, deductions: 800 },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { paid: 20, sick: 10, casual: 7, unpaid: 0 },
    verified: true
  },
  {
    id: 'OISAJE20220001',
    name: 'Sarah Jenkins',
    email: 'sarah@dayflow.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    position: 'Senior Frontend Engineer',
    phone: '+1 (555) 438-9102',
    address: '128 Innovation Way, Techville, CA',
    joinDate: '2022-06-01',
    companyName: 'Odoo India',
    salary: { basic: 6200, hra: 2000, allowances: 1200, deductions: 650 },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { paid: 15, sick: 8, casual: 5, unpaid: 0 },
    verified: true
  },
  {
    id: 'OIALRI20230001',
    name: 'Alex Rivera',
    email: 'alex@dayflow.com',
    password: 'password123',
    role: 'employee',
    department: 'Product Design',
    position: 'Lead UX Specialist',
    phone: '+1 (555) 872-3019',
    address: '45 Creative Ave, Design District, NY',
    joinDate: '2023-01-10',
    companyName: 'Odoo India',
    salary: { basic: 5800, hra: 1800, allowances: 1000, deductions: 550 },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { paid: 18, sick: 10, casual: 6, unpaid: 0 },
    verified: true
  },
  {
    id: 'OIMACH20230002',
    name: 'Marcus Chen',
    email: 'marcus@dayflow.com',
    password: 'password123',
    role: 'employee',
    department: 'Marketing',
    position: 'Growth Marketing Specialist',
    phone: '+1 (555) 234-5678',
    address: '89 Market St, San Francisco, CA',
    joinDate: '2023-08-15',
    companyName: 'Odoo India',
    salary: { basic: 5000, hra: 1500, allowances: 800, deductions: 450 },
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    leaveBalance: { paid: 14, sick: 9, casual: 4, unpaid: 0 },
    verified: true
  }
];

const SEED_ATTENDANCE = [
  { id: 'att-1', userId: 'OISAJE20220001', date: '2026-08-22', checkIn: '09:02 AM', checkOut: '-', workHours: 'In Progress', status: 'Present' },
  { id: 'att-2', userId: 'OIELVA20210001', date: '2026-08-22', checkIn: '08:55 AM', checkOut: '-', workHours: 'In Progress', status: 'Present' },
  { id: 'att-3', userId: 'OIALRI20230001', date: '2026-08-22', checkIn: '09:45 AM', checkOut: '02:00 PM', workHours: '4h 15m', status: 'Half-day' },
  { id: 'att-4', userId: 'OIMACH20230002', date: '2026-08-22', checkIn: '-', checkOut: '-', workHours: '0h 00m', status: 'Absent' },
  { id: 'att-5', userId: 'OISAJE20220001', date: '2026-08-21', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: '8h 30m', status: 'Present' },
  { id: 'att-6', userId: 'OIALRI20230001', date: '2026-08-21', checkIn: '09:10 AM', checkOut: '05:40 PM', workHours: '8h 30m', status: 'Present' },
  { id: 'att-7', userId: 'OIELVA20210001', date: '2026-08-21', checkIn: '08:45 AM', checkOut: '06:00 PM', workHours: '9h 15m', status: 'Present' }
];

const SEED_LEAVES = [
  {
    id: 'LV-101',
    userId: 'OISAJE20220001',
    userName: 'Sarah Jenkins',
    leaveType: 'Paid Leave',
    startDate: '2026-08-28',
    endDate: '2026-08-30',
    totalDays: 3,
    reason: 'Family vacation trip',
    status: 'Pending',
    appliedOn: '2026-08-20',
    comments: ''
  },
  {
    id: 'LV-102',
    userId: 'OIALRI20230001',
    userName: 'Alex Rivera',
    leaveType: 'Sick Leave',
    startDate: '2026-08-18',
    endDate: '2026-08-19',
    totalDays: 2,
    reason: 'Severe flu & fever',
    status: 'Approved',
    appliedOn: '2026-08-17',
    comments: 'Get well soon! Approved by HR.'
  },
  {
    id: 'LV-103',
    userId: 'OIMACH20230002',
    userName: 'Marcus Chen',
    leaveType: 'Casual Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-25',
    totalDays: 1,
    reason: 'Personal urgent work',
    status: 'Rejected',
    appliedOn: '2026-08-19',
    comments: 'Critical marketing campaign release scheduled on this day.'
  }
];

class DB {
  constructor() {
    this.init();
  }

  init() {
    // Reset seed users if old schema
    const existing = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existing || existing.includes('EMP-001')) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(SEED_ATTENDANCE));
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(SEED_LEAVES));
    }
  }

  // Users Methods
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
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
    const idx = users.findIndex(u => u.id.toLowerCase() === user.id.toLowerCase());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update active session if saving current user
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

    // Cleanup associated attendance records
    const attendance = this.getAttendance().filter(a => a.userId.toLowerCase() !== targetId);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));

    // Cleanup associated leave records
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
    return this.getAttendance().filter(a => a.userId.toLowerCase() === userId.toLowerCase());
  }

  addAttendanceRecord(record) {
    const list = this.getAttendance();
    list.unshift(record);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
  }

  updateAttendanceRecord(record) {
    const list = this.getAttendance();
    const idx = list.findIndex(a => a.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
    }
  }

  // Leave Methods
  getLeaves() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEAVES) || '[]');
  }

  getUserLeaves(userId) {
    return this.getLeaves().filter(l => l.userId.toLowerCase() === userId.toLowerCase());
  }

  addLeave(leave) {
    const leaves = this.getLeaves();
    leaves.unshift(leave);
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }

  updateLeaveStatus(leaveId, status, comments = '') {
    const leaves = this.getLeaves();
    const leave = leaves.find(l => l.id === leaveId);
    if (leave) {
      const oldStatus = leave.status;
      leave.status = status;
      leave.comments = comments;
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));

      // Auto deduct leave quota on approval
      if (status === 'Approved' && oldStatus !== 'Approved') {
        const user = this.getUserById(leave.userId);
        if (user && user.leaveBalance) {
          const typeKey = leave.leaveType.toLowerCase().includes('paid') ? 'paid' :
            leave.leaveType.toLowerCase().includes('sick') ? 'sick' :
              leave.leaveType.toLowerCase().includes('casual') ? 'casual' : 'unpaid';

          if (typeKey !== 'unpaid' && user.leaveBalance[typeKey] !== undefined) {
            user.leaveBalance[typeKey] = Math.max(0, user.leaveBalance[typeKey] - leave.totalDays);
            this.saveUser(user);
          }
        }
      }
    }
  }
}

export const db = new DB();
