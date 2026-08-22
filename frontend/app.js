/* =============================================================================
   Dayflow HRMS - Reactive Application Engine & State Manager
   "Every workday, perfectly aligned."
   ============================================================================= */

// Global Application State
const appState = {
  activeScreen: 'login', // 'login', 'register', 'appPortal'
  currentRole: 'employee', // 'employee' or 'hr'
  activeEmployeeId: 2,

  employees: [
    {
      id: 1,
      employee_id: 'EMP-0001',
      name: 'Alice Johnson (HR Admin)',
      email: 'alice.hr@dayflow.com',
      role: 'hr',
      job_title: 'HR Director',
      department: 'Human Resources',
      phone: '+1 (555) 019-2831',
      address: '100 Enterprise Way, Suite 400, San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      basic_salary: 8500.00,
      allowances: 1200.00,
      deductions: 700.00
    },
    {
      id: 2,
      employee_id: 'EMP-0002',
      name: 'Bob Smith',
      email: 'bob.smith@dayflow.com',
      role: 'employee',
      job_title: 'Senior Backend Engineer',
      department: 'Engineering',
      phone: '+1 (555) 014-9922',
      address: '742 Evergreen Terrace, Springfield',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      basic_salary: 6500.00,
      allowances: 800.00,
      deductions: 500.00
    },
    {
      id: 3,
      employee_id: 'EMP-0003',
      name: 'Charlie Davis',
      email: 'charlie.davis@dayflow.com',
      role: 'employee',
      job_title: 'Product Designer',
      department: 'Design',
      phone: '+1 (555) 018-3344',
      address: '123 Market Street, Apt 5B, New York, NY',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      basic_salary: 5800.00,
      allowances: 600.00,
      deductions: 450.00
    }
  ],

  pendingRegistrations: [
    {
      id: 101,
      name: 'David Miller',
      email: 'david.miller@gmail.com',
      job_title: 'Frontend Engineer',
      department: 'Engineering',
      phone: '+1 (555) 012-7788',
      address: '456 Tech Boulevard, Austin, TX',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      applied_date: '2026-08-22'
    }
  ],

  attendances: [
    { id: 1, employee_id: 2, date: '2026-08-22', check_in: '09:00:00', check_out: null, worked_hours: 0.0, status: 'present' },
    { id: 2, employee_id: 3, date: '2026-08-22', check_in: '09:30:00', check_out: '13:30:00', worked_hours: 4.0, status: 'half_day' },
    { id: 3, employee_id: 2, date: '2026-08-21', check_in: '09:00:00', check_out: '17:00:00', worked_hours: 8.0, status: 'present' },
    { id: 4, employee_id: 3, date: '2026-08-21', check_in: '09:15:00', check_out: '17:15:00', worked_hours: 8.0, status: 'present' }
  ],

  leaves: [
    { id: 1, employee_id: 3, leave_type: 'paid', start_date: '2026-08-25', end_date: '2026-08-27', days: 3, remarks: 'Annual family vacation trip.', state: 'pending', admin_comment: '' }
  ],

  payrolls: [
    { id: 1, employee_id: 2, period: 'August 2026', basic: 6500.00, allowances: 800.00, deductions: 500.00, net: 6800.00, status: 'paid' },
    { id: 2, employee_id: 3, period: 'August 2026', basic: 5800.00, allowances: 600.00, deductions: 450.00, net: 5950.00, status: 'verified' }
  ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  navigateToScreen('login');
});

// Toast Notification Alert Helper
function showToast(message, icon = '✨') {
  const toast = document.getElementById('toastAlert');
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMessage').textContent = message;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

// Navigation between main screens
function navigateToScreen(screenId) {
  appState.activeScreen = screenId;
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));

  const navHeader = document.getElementById('appNavbar');

  if (screenId === 'login') {
    document.getElementById('loginScreen').classList.add('active');
    navHeader.style.display = 'none';
  } else if (screenId === 'register') {
    document.getElementById('registerScreen').classList.add('active');
    navHeader.style.display = 'none';
  } else if (screenId === 'appPortal') {
    document.getElementById('appPortalView').classList.add('active');
    navHeader.style.display = 'flex';
    renderAll();
  }
}

// Google Sign-In Action
function handleGoogleSignIn() {
  showToast('Google Authentication Successful! Logging in...', '🌐');
  appState.activeEmployeeId = 2;
  switchRole('employee');
  navigateToScreen('appPortal');
}

// Standard Login Form Action
function handleStandardLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();

  const user = appState.employees.find(e => e.email.toLowerCase() === email);
  if (user) {
    appState.activeEmployeeId = user.id;
    switchRole(user.role);
    showToast(`Welcome back, ${user.name}!`, '🔑');
    navigateToScreen('appPortal');
  } else {
    // Check if pending registration
    const pending = appState.pendingRegistrations.find(r => r.email.toLowerCase() === email);
    if (pending) {
      showToast('Registration pending HR Admin approval. Check your Gmail once approved!', '⏳');
    } else {
      showToast('Account not found. Please click Sign Up to submit a registration request.', '⚠️');
    }
  }
}

// Quick Demo Access Login
function quickDemoLogin(role) {
  if (role === 'employee') {
    appState.activeEmployeeId = 2;
    switchRole('employee');
  } else {
    appState.activeEmployeeId = 1;
    switchRole('hr');
  }
  showToast(`Quick Login active: ${role.toUpperCase()} View`, '⚡');
  navigateToScreen('appPortal');
}

// Candidate Registration Submission
function handleRegistrationSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const job = document.getElementById('regJob').value.trim() || 'Software Developer';
  const dept = document.getElementById('regDept').value;
  const phone = document.getElementById('regPhone').value.trim() || '+1 (555) 000-1122';
  const avatar = document.getElementById('regAvatar').value.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
  const address = document.getElementById('regAddress').value.trim() || 'Springfield, USA';

  const newReg = {
    id: Date.now(),
    name,
    email,
    job_title: job,
    department: dept,
    phone,
    address,
    avatar,
    applied_date: new Date().toISOString().split('T')[0]
  };

  appState.pendingRegistrations.push(newReg);
  showToast('Registration submitted! Account will activate upon HR Admin approval.', '📩');
  navigateToScreen('login');
}

// HR Admin Approval of Employee Registration
function approveRegistration(regId) {
  const index = appState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index === -1) return;

  const reg = appState.pendingRegistrations[index];
  const newEmpIdCode = `EMP-000${appState.employees.length + 1}`;
  const generatedPassword = `Dayflow#2026!Pass`;

  const newEmp = {
    id: appState.employees.length + 1,
    employee_id: newEmpIdCode,
    name: reg.name,
    email: reg.email,
    role: 'employee',
    job_title: reg.job_title,
    department: reg.department,
    phone: reg.phone,
    address: reg.address,
    avatar: reg.avatar,
    basic_salary: 6000.00,
    allowances: 700.00,
    deductions: 400.00
  };

  appState.employees.push(newEmp);
  appState.pendingRegistrations.splice(index, 1);

  showToast(`Registration Approved! Password (${generatedPassword}) sent to ${reg.email}`, '✉️');
  renderAll();
}

function rejectRegistration(regId) {
  const index = appState.pendingRegistrations.findIndex(r => r.id === regId);
  if (index !== -1) {
    appState.pendingRegistrations.splice(index, 1);
    showToast('Registration request rejected.', '❌');
    renderAll();
  }
}

// Real-Time Clock Function
function startClock() {
  const clockEl = document.getElementById('liveClock');
  setInterval(() => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString();
    }
  }, 1000);
}

// Role Switcher Handler
function switchRole(role) {
  appState.currentRole = role;

  const roleBtnEmp = document.getElementById('roleBtnEmployee');
  const roleBtnHR = document.getElementById('roleBtnHR');
  const empView = document.getElementById('employeePortalView');
  const hrView = document.getElementById('hrPortalView');

  if (role === 'employee') {
    roleBtnEmp.classList.add('active');
    roleBtnHR.classList.remove('active');
    empView.classList.add('active');
    hrView.classList.remove('active');
  } else {
    roleBtnHR.classList.add('active');
    roleBtnEmp.classList.remove('active');
    hrView.classList.add('active');
    empView.classList.remove('active');
  }

  renderAll();
}

// Render All UI Components Reactively
function renderAll() {
  renderHeaderUser();
  renderEmployeeDashboard();
  renderHrDashboard();
}

// Render Header User Badge
function renderHeaderUser() {
  const emp = appState.employees.find(e => e.id === appState.activeEmployeeId);
  if (!emp) return;

  document.getElementById('headerAvatar').src = emp.avatar;
  document.getElementById('headerName').textContent = emp.name;
  document.getElementById('headerRole').textContent = emp.role === 'hr' ? 'HR Officer / Admin' : emp.job_title;
}

// Render Employee Portal View
function renderEmployeeDashboard() {
  const emp = appState.employees.find(e => e.id === appState.activeEmployeeId);
  if (!emp) return;

  document.getElementById('welcomeMsg').textContent = `Good day, ${emp.name.split(' ')[0]}!`;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAtt = appState.attendances.find(a => a.employee_id === emp.id && a.date === todayStr);

  const badge = document.getElementById('attStatusBadge');
  const btnIn = document.getElementById('btnCheckIn');
  const btnOut = document.getElementById('btnCheckOut');
  const workedHrsEl = document.getElementById('workedHrsToday');

  if (todayAtt && todayAtt.check_in && !todayAtt.check_out) {
    badge.className = 'badge badge-present';
    badge.textContent = '● Checked In';
    btnIn.disabled = true;
    btnOut.disabled = false;

    const inTime = new Date(`${todayStr}T${todayAtt.check_in}`);
    const hrs = Math.max(0, ((new Date() - inTime) / 3600000)).toFixed(1);
    workedHrsEl.textContent = `${hrs} hrs`;
  } else if (todayAtt && todayAtt.check_out) {
    badge.className = 'badge badge-halfday';
    badge.textContent = '● Shift Completed';
    btnIn.disabled = true;
    btnOut.disabled = true;
    workedHrsEl.textContent = `${todayAtt.worked_hours.toFixed(1)} hrs`;
  } else {
    badge.className = 'badge badge-absent';
    badge.textContent = '● Checked Out';
    btnIn.disabled = false;
    btnOut.disabled = true;
    workedHrsEl.textContent = '0.0 hrs';
  }

  // Render Attendance Table
  const attTbody = document.getElementById('empAttendanceTableBody');
  const myAtts = appState.attendances.filter(a => a.employee_id === emp.id);
  attTbody.innerHTML = myAtts.map(a => `
    <tr>
      <td><strong>${a.date}</strong></td>
      <td>${a.check_in || '--:--'}</td>
      <td>${a.check_out || '--:--'}</td>
      <td>${a.worked_hours.toFixed(1)} hrs</td>
      <td><span class="badge badge-${a.status}">${a.status}</span></td>
    </tr>
  `).join('');

  // Render Leave Table
  const leaveTbody = document.getElementById('empLeaveTableBody');
  const myLeaves = appState.leaves.filter(l => l.employee_id === emp.id);
  leaveTbody.innerHTML = myLeaves.length ? myLeaves.map(l => `
    <tr>
      <td>${l.start_date}</td>
      <td style="text-transform: capitalize;">${l.leave_type} Leave</td>
      <td>${l.start_date}</td>
      <td>${l.end_date}</td>
      <td>${l.days} Days</td>
      <td>${l.remarks || 'N/A'}</td>
      <td><span class="badge badge-${l.state}">${l.state}</span></td>
    </tr>
  `).join('') : `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No leave requests submitted yet.</td></tr>`;

  // Render Profile Tab
  document.getElementById('profileDisplayImg').src = emp.avatar;
  document.getElementById('profileDisplayName').textContent = emp.name;
  document.getElementById('profileDisplayCode').textContent = emp.employee_id;
  document.getElementById('profileDisplayJob').textContent = emp.job_title;
  document.getElementById('profileDisplayDept').textContent = emp.department;
  document.getElementById('profileDisplayEmail').textContent = emp.email;
  document.getElementById('profileDisplayPhone').textContent = emp.phone;
  document.getElementById('profileDisplayAddress').textContent = emp.address;

  // Render Salary Statement (Read-Only)
  const net = emp.basic_salary + emp.allowances - emp.deductions;
  document.getElementById('payrollBasic').textContent = `$${emp.basic_salary.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('payrollAllowances').textContent = `+$${emp.allowances.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('payrollDeductions').textContent = `-$${emp.deductions.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
  document.getElementById('payrollNet').textContent = `$${net.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
}

// Render HR Admin Control Center
function renderHrDashboard() {
  const totalEmp = appState.employees.length;
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = appState.attendances.filter(a => a.date === todayStr && a.status === 'present').length;
  const pendingRegs = appState.pendingRegistrations.length;

  document.getElementById('hrStatTotalEmp').textContent = totalEmp;
  document.getElementById('hrStatPresentToday').textContent = presentToday;
  document.getElementById('hrStatPendingRegs').textContent = pendingRegs;
  document.getElementById('regQueueCountBadge').textContent = pendingRegs;

  // Render Employee Directory Cards
  const cardsGrid = document.getElementById('hrEmployeeCardsGrid');
  cardsGrid.innerHTML = appState.employees.map(e => {
    const net = e.basic_salary + e.allowances - e.deductions;
    return `
      <div class="glass-panel employee-card">
        <img src="${e.avatar}" class="emp-avatar" alt="${e.name}">
        <h4 style="margin-bottom: 0.25rem;">${e.name}</h4>
        <div style="font-size: 0.8rem; color: var(--accent-primary); margin-bottom: 0.5rem;">${e.employee_id} • ${e.role.toUpperCase()}</div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${e.job_title} (${e.department})</div>
        <div style="font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">Net Pay: $${net.toLocaleString()}</div>
        <button class="btn btn-secondary" style="width: 100%; justify-content: center;" onclick="openAdminEditModal(${e.id})">✏ Edit Profile &amp; Salary</button>
      </div>
    `;
  }).join('');

  // Render Pending Registration Requests Queue
  const regTbody = document.getElementById('hrRegQueueTableBody');
  regTbody.innerHTML = appState.pendingRegistrations.length ? appState.pendingRegistrations.map(r => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td>${r.email}</td>
      <td>${r.job_title}</td>
      <td>${r.department}</td>
      <td>${r.phone}</td>
      <td>${r.applied_date}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="approveRegistration(${r.id})">Approve &amp; Send Gmail Pass</button>
          <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="rejectRegistration(${r.id})">Reject</button>
        </div>
      </td>
    </tr>
  `).join('') : `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No pending registration requests in queue.</td></tr>`;

  // Render Pending Leave Approvals Queue
  const hrLeaveTbody = document.getElementById('hrLeaveApprovalTableBody');
  const pendingList = appState.leaves.filter(l => l.state === 'pending');
  hrLeaveTbody.innerHTML = pendingList.length ? pendingList.map(l => {
    const emp = appState.employees.find(e => e.id === l.employee_id);
    return `
      <tr>
        <td><strong>${emp ? emp.name : 'Employee'}</strong></td>
        <td style="text-transform: capitalize;">${l.leave_type} Leave</td>
        <td>${l.start_date} to ${l.end_date} (${l.days} Days)</td>
        <td>${l.remarks || 'None'}</td>
        <td><span class="badge badge-pending">Pending</span></td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-success" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="processLeave(${l.id}, 'approved')">Approve</button>
            <button class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="processLeave(${l.id}, 'rejected')">Reject</button>
          </div>
        </td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No pending leave approvals in queue.</td></tr>`;

  // Render Company Attendance Logs
  const hrAttTbody = document.getElementById('hrAttendanceTableBody');
  hrAttTbody.innerHTML = appState.attendances.map(a => {
    const emp = appState.employees.find(e => e.id === a.employee_id);
    return `
      <tr>
        <td><strong>${a.date}</strong></td>
        <td>${emp ? emp.name : 'Unknown'} (${emp ? emp.employee_id : ''})</td>
        <td>${a.check_in || '--:--'}</td>
        <td>${a.check_out || '--:--'}</td>
        <td>${a.worked_hours.toFixed(1)} hrs</td>
        <td><span class="badge badge-${a.status}">${a.status}</span></td>
      </tr>
    `;
  }).join('');

  // Render HR Payroll Control Table
  const hrPayTbody = document.getElementById('hrPayrollTableBody');
  hrPayTbody.innerHTML = appState.employees.map(e => {
    const net = e.basic_salary + e.allowances - e.deductions;
    return `
      <tr>
        <td><strong>${e.name}</strong> (${e.employee_id})</td>
        <td>${e.job_title}</td>
        <td>$${e.basic_salary.toLocaleString()}</td>
        <td style="color: var(--success);">+$${e.allowances.toLocaleString()}</td>
        <td style="color: var(--danger);">-$${e.deductions.toLocaleString()}</td>
        <td><strong style="color: var(--accent-primary);">$${net.toLocaleString()}</strong></td>
        <td><button class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openAdminEditModal(${e.id})">Update Structure</button></td>
      </tr>
    `;
  }).join('');
}

// User Actions: Check-In & Check-Out
function handleCheckIn() {
  const empId = appState.activeEmployeeId;
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0];

  let att = appState.attendances.find(a => a.employee_id === empId && a.date === todayStr);
  if (!att) {
    att = { id: appState.attendances.length + 1, employee_id: empId, date: todayStr, check_in: nowTime, check_out: null, worked_hours: 0.0, status: 'present' };
    appState.attendances.unshift(att);
  } else {
    att.check_in = nowTime;
    att.status = 'present';
  }

  showToast('Checked in successfully!', '▶');
  renderAll();
}

function handleCheckOut() {
  const empId = appState.activeEmployeeId;
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0];

  let att = appState.attendances.find(a => a.employee_id === empId && a.date === todayStr);
  if (att && att.check_in) {
    att.check_out = nowTime;
    const inDate = new Date(`${todayStr}T${att.check_in}`);
    const outDate = new Date(`${todayStr}T${nowTime}`);
    const hrs = Math.round(((outDate - inDate) / 3600000) * 10) / 10;
    att.worked_hours = hrs;
    att.status = hrs >= 7.0 ? 'present' : (hrs >= 3.5 ? 'half_day' : 'absent');
  }

  showToast('Checked out successfully!', '⏹');
  renderAll();
}

// Leave Application Modal Handlers
function openLeaveModal() {
  document.getElementById('leaveModal').classList.add('active');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('leaveStartDate').value = today;
  document.getElementById('leaveEndDate').value = today;
  calculateLeaveDays();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function calculateLeaveDays() {
  const start = new Date(document.getElementById('leaveStartDate').value);
  const end = new Date(document.getElementById('leaveEndDate').value);
  if (start && end && end >= start) {
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    document.getElementById('leaveDaysCount').textContent = `Total Duration: ${diff} Day(s)`;
  } else {
    document.getElementById('leaveDaysCount').textContent = `Invalid Date Range`;
  }
}

function submitLeaveApplication(event) {
  event.preventDefault();
  const leaveType = document.getElementById('leaveType').value;
  const start = document.getElementById('leaveStartDate').value;
  const end = document.getElementById('leaveEndDate').value;
  const remarks = document.getElementById('leaveRemarks').value;

  const startDt = new Date(start);
  const endDt = new Date(end);
  const days = Math.floor((endDt - startDt) / (1000 * 60 * 60 * 24)) + 1;

  const newLeave = {
    id: appState.leaves.length + 1,
    employee_id: appState.activeEmployeeId,
    leave_type: leaveType,
    start_date: start,
    end_date: end,
    days: days,
    remarks: remarks,
    state: 'pending',
    admin_comment: ''
  };

  appState.leaves.unshift(newLeave);
  closeModal('leaveModal');
  showToast('Leave request submitted to HR for approval!', '✈');
  renderAll();
}

// HR Admin Leave Approval Handler
function processLeave(leaveId, state) {
  const leave = appState.leaves.find(l => l.id === leaveId);
  if (!leave) return;

  leave.state = state;

  if (state === 'approved') {
    let curr = new Date(leave.start_date);
    const end = new Date(leave.end_date);

    while (curr <= end) {
      const dtStr = curr.toISOString().split('T')[0];
      let att = appState.attendances.find(a => a.employee_id === leave.employee_id && a.date === dtStr);
      if (att) {
        att.status = 'leave';
      } else {
        appState.attendances.unshift({ id: appState.attendances.length + 1, employee_id: leave.employee_id, date: dtStr, check_in: null, check_out: null, worked_hours: 0, status: 'leave' });
      }
      curr.setDate(curr.getDate() + 1);
    }
    showToast('Leave approved & attendance updated!', '✓');
  } else {
    showToast('Leave request rejected.', '❌');
  }

  renderAll();
}

// Admin Edit Employee Modal
function openAdminEditModal(empId) {
  const emp = appState.employees.find(e => e.id === empId);
  if (!emp) return;

  document.getElementById('editEmpId').value = emp.id;
  document.getElementById('editEmpName').value = emp.name;
  document.getElementById('editEmpJob').value = emp.job_title;
  document.getElementById('editEmpDept').value = emp.department;
  document.getElementById('editEmpBasic').value = emp.basic_salary;
  document.getElementById('editEmpAllowances').value = emp.allowances;
  document.getElementById('editEmpDeductions').value = emp.deductions;

  document.getElementById('adminEditModal').classList.add('active');
}

function saveAdminEmployeeEdit(event) {
  event.preventDefault();
  const empId = parseInt(document.getElementById('editEmpId').value);
  const emp = appState.employees.find(e => e.id === empId);
  if (!emp) return;

  emp.name = document.getElementById('editEmpName').value;
  emp.job_title = document.getElementById('editEmpJob').value;
  emp.department = document.getElementById('editEmpDept').value;
  emp.basic_salary = parseFloat(document.getElementById('editEmpBasic').value) || 0;
  emp.allowances = parseFloat(document.getElementById('editEmpAllowances').value) || 0;
  emp.deductions = parseFloat(document.getElementById('editEmpDeductions').value) || 0;

  closeModal('adminEditModal');
  showToast('Employee profile and salary updated!', '✏');
  renderAll();
}

// Employee Tab Switching
function switchEmpTab(tabName) {
  document.querySelectorAll('#employeePortalView .tab-link').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#employeePortalView .tab-pane').forEach(pane => pane.classList.remove('active'));

  event.target.classList.add('active');
  const tabId = 'empTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
  document.getElementById(tabId).classList.add('active');
}

// HR Admin Tab Switching
function switchHrTab(tabName) {
  document.querySelectorAll('#hrPortalView .tab-link').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#hrPortalView .tab-pane').forEach(pane => pane.classList.remove('active'));

  event.target.classList.add('active');
  const tabId = 'hrTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
  document.getElementById(tabId).classList.add('active');
}

// Search Filter
function filterEmployeeList(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.employee-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? 'block' : 'none';
  });
}
