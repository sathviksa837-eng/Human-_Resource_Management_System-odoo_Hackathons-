/* Dayflow HRMS - Dashboard Module */
import { db, generateEmployeeID } from './db.js';
import { Auth } from './auth.js';

export class Dashboard {
  static timerInterval = null;

  static render(container, onNavigate, activeUser = null) {
    if (Dashboard.timerInterval) {
      clearInterval(Dashboard.timerInterval);
      Dashboard.timerInterval = null;
    }

    const currentUser = activeUser || Auth.getCurrentUser();
    if (!currentUser) return;

    const activeMode = window.AppActivePortalMode || currentUser.role;
    if (activeMode === 'admin') {
      Dashboard.renderAdminDashboard(container, currentUser, onNavigate);
    } else {
      Dashboard.renderEmployeeDashboard(container, currentUser, onNavigate);
    }
  }

  static renderEmployeeDashboard(container, user, onNavigate) {
    const today = new Date().toISOString().split('T')[0];
    const userAttendance = db.getUserAttendance(user.id);
    const todayRecord = userAttendance.find(a => a.date === today);
    const userLeaves = db.getUserLeaves(user.id);
    const pendingLeaves = userLeaves.filter(l => l.status === 'Pending').length;

    const isCheckedIn = todayRecord && todayRecord.checkIn !== '-' && todayRecord.checkOut === '-';

    const html = `
      <div class="checkin-widget">
        <div class="checkin-info">
          <h3>Welcome back, ${user.name}!</h3>
          <p style="opacity: 0.9; font-size: 0.9rem;">${user.position} • ${user.department}</p>
          <div style="margin-top: 0.75rem;">
            <span class="role-badge employee" style="background: rgba(255,255,255,0.2); color: white;">
              Login ID: ${user.id}
            </span>
          </div>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 0.85rem; opacity: 0.85; margin-bottom: 0.2rem;">Live Shift Timer</p>
          <div class="timer-display" id="dash-timer">00:00:00</div>
          <button class="btn btn-accent" id="dash-checkin-btn" style="margin-top: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            ${isCheckedIn ? 'Punch Out (Check Out)' : 'Punch In (Check In)'}
          </button>
        </div>
      </div>

      <div class="grid-stats">
        <div class="stat-card" style="cursor: pointer;" id="card-nav-profile">
          <div class="stat-details">
            <p>My Profile</p>
            <h3 style="font-size: 1.1rem; font-family: monospace;">${user.id}</h3>
            <p style="color: var(--primary-accent); margin-top: 0.25rem;">View & Edit Info →</p>
          </div>
          <div class="stat-icon primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </div>

        <div class="stat-card" style="cursor: pointer;" id="card-nav-attendance">
          <div class="stat-details">
            <p>Attendance Record</p>
            <h3>${userAttendance.filter(a => a.status === 'Present').length} Days</h3>
            <p style="color: var(--status-present); margin-top: 0.25rem;">Present this month →</p>
          </div>
          <div class="stat-icon success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        </div>

        <div class="stat-card" style="cursor: pointer;" id="card-nav-leave">
          <div class="stat-details">
            <p>Leave Requests</p>
            <h3>${pendingLeaves} Pending</h3>
            <p style="color: var(--status-halfday); margin-top: 0.25rem;">${user.leaveBalance ? user.leaveBalance.paid : 15} Paid Days Left →</p>
          </div>
          <div class="stat-icon warning">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="stat-card" style="cursor: pointer;" id="card-nav-payroll">
          <div class="stat-details">
            <p>Monthly Net Pay</p>
            <h3>$${(user.salary.basic + user.salary.hra + user.salary.allowances - user.salary.deductions).toLocaleString()}</h3>
            <p style="color: var(--primary-accent); margin-top: 0.25rem;">View Pay Slips →</p>
          </div>
          <div class="stat-icon accent">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Attendance Activity</h3>
            <button class="btn btn-secondary btn-sm" id="btn-dash-view-att">View All</button>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${userAttendance.slice(0, 5).map(att => `
                  <tr>
                    <td><strong>${att.date}</strong></td>
                    <td>${att.checkIn}</td>
                    <td>${att.checkOut}</td>
                    <td>${att.workHours}</td>
                    <td><span class="badge badge-${att.status.toLowerCase().replace('-', '')}">${att.status}</span></td>
                  </tr>
                `).join('')}
                ${userAttendance.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 1.5rem;">No attendance records found yet.</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Leave Summary</h3>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md);">
              <span>Paid Leave Balance</span>
              <strong>${user.leaveBalance ? user.leaveBalance.paid : 15} Days</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md);">
              <span>Sick Leave Balance</span>
              <strong>${user.leaveBalance ? user.leaveBalance.sick : 8} Days</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md);">
              <span>Casual Leave Balance</span>
              <strong>${user.leaveBalance ? user.leaveBalance.casual : 5} Days</strong>
            </div>
            <button class="btn btn-purple" id="btn-dash-apply-leave" style="margin-top: 0.5rem; width: 100%;">
              Apply for Time Off
            </button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Start Live Shift Timer if Checked In
    const timerElem = document.getElementById('dash-timer');
    if (isCheckedIn && todayRecord) {
      let checkInTime;
      try {
        const [time, modifier] = todayRecord.checkIn.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        checkInTime = new Date();
        checkInTime.setHours(hours, minutes, 0);
      } catch (e) {
        checkInTime = new Date();
      }

      const updateTimer = () => {
        const diff = Math.max(0, new Date() - checkInTime);
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        if (timerElem) timerElem.innerText = `${h}:${m}:${s}`;
      };

      updateTimer();
      Dashboard.timerInterval = setInterval(updateTimer, 1000);
    } else {
      if (timerElem) timerElem.innerText = '00:00:00';
    }

    // Attach Event Handlers
    document.getElementById('card-nav-profile')?.addEventListener('click', () => onNavigate('profile'));
    document.getElementById('card-nav-attendance')?.addEventListener('click', () => onNavigate('attendance'));
    document.getElementById('card-nav-leave')?.addEventListener('click', () => onNavigate('leave'));
    document.getElementById('card-nav-payroll')?.addEventListener('click', () => onNavigate('payroll'));
    document.getElementById('btn-dash-apply-leave')?.addEventListener('click', () => onNavigate('leave'));
    document.getElementById('btn-dash-view-att')?.addEventListener('click', () => onNavigate('attendance'));

    document.getElementById('dash-checkin-btn')?.addEventListener('click', () => {
      onNavigate('attendance');
    });
  }

  static renderAdminDashboard(container, user, onNavigate) {
    const allUsers = db.getUsers();
    const allAttendance = db.getAttendance();
    const allLeaves = db.getLeaves();

    const today = new Date().toISOString().split('T')[0];
    const presentToday = allAttendance.filter(a => a.date === today && a.status === 'Present').length;
    const pendingLeaves = allLeaves.filter(l => l.status === 'Pending').length;

    let totalMonthlyPayroll = 0;
    allUsers.forEach(u => {
      const sal = u.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
      totalMonthlyPayroll += (sal.basic + sal.hra + sal.allowances - sal.deductions);
    });

    const html = `
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">Admin & HR Command Center</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Overview of company workforce, attendance metrics, and pending approvals.</p>
        </div>
        <span class="role-badge admin">HR Administrator Privileges</span>
      </div>

      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-details">
            <p>Total Workforce</p>
            <h3>${allUsers.length} Employees</h3>
            <p style="color: var(--accent); margin-top: 0.25rem;">Active staff</p>
          </div>
          <div class="stat-icon primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Present Today</p>
            <h3>${presentToday} Staff</h3>
            <p style="color: var(--status-present); margin-top: 0.25rem;">Checked in on duty</p>
          </div>
          <div class="stat-icon success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="stat-card" style="cursor: pointer;" id="card-admin-pending">
          <div class="stat-details">
            <p>Pending Approvals</p>
            <h3>${pendingLeaves} Requests</h3>
            <p style="color: var(--status-halfday); margin-top: 0.25rem;">Requires HR review →</p>
          </div>
          <div class="stat-icon warning">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
        </div>

        <div class="stat-card" style="cursor: pointer;" id="card-admin-payroll">
          <div class="stat-details">
            <p>Monthly Payroll</p>
            <h3>$${totalMonthlyPayroll.toLocaleString()}</h3>
            <p style="color: var(--primary-accent); margin-top: 0.25rem;">Total commitment →</p>
          </div>
          <div class="stat-icon accent">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      <!-- Employee Management & Directory Card -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 class="card-title" style="display: flex; align-items: center; gap: 0.5rem;">
              Employee Directory
              <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-muted);">
                (🟢 Present • ✈️ On Leave • 🟡 Absent)
              </span>
            </h3>
          </div>
          
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <!-- View Switcher Toggle (Grid Cards vs Table) -->
            <div style="display: flex; background: var(--bg-surface-secondary); border-radius: var(--radius-md); padding: 2px; border: 1px solid var(--border-color);">
              <button class="btn btn-sm btn-secondary active" id="btn-view-cards" title="Grid Cards View" style="padding: 0.35rem 0.6rem; font-size: 0.85rem;">🎴 Cards</button>
              <button class="btn btn-sm btn-secondary" id="btn-view-table" title="Table View" style="padding: 0.35rem 0.6rem; font-size: 0.85rem;">≡ Table</button>
            </div>

            <input type="text" id="admin-emp-search" class="form-control" placeholder="Search by name, Login ID..." style="width: 210px; padding: 0.4rem 0.75rem; font-size: 0.85rem;" />
            <select id="admin-emp-dept-filter" class="form-control" style="width: 160px; padding: 0.4rem 0.75rem; font-size: 0.85rem;">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product Design">Product Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
            </select>
            <button class="btn btn-purple btn-sm" id="btn-admin-add-emp">
              + Register Employee
            </button>
          </div>
        </div>

        <!-- Grid Cards Container (Default View Mode) -->
        <div id="emp-cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.15rem; padding-top: 0.5rem;">
          ${Dashboard.renderEmpCards(allUsers)}
        </div>

        <!-- Table View Container (Optional Toggle) -->
        <div id="emp-table-container" class="table-container" style="display: none;">
          <table class="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Login ID (Auto Format)</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="admin-emp-table-body">
              ${Dashboard.renderEmpRows(allUsers)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // View Switcher Handler
    const btnViewCards = container.querySelector('#btn-view-cards');
    const btnViewTable = container.querySelector('#btn-view-table');
    const cardsContainer = container.querySelector('#emp-cards-container');
    const tableContainer = container.querySelector('#emp-table-container');

    btnViewCards?.addEventListener('click', () => {
      btnViewCards.classList.add('active');
      btnViewTable?.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'grid';
      if (tableContainer) tableContainer.style.display = 'none';
    });

    btnViewTable?.addEventListener('click', () => {
      btnViewTable.classList.add('active');
      btnViewCards?.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (tableContainer) tableContainer.style.display = 'block';
    });

    // Attach Search & Department Filter logic
    const searchInput = container.querySelector('#admin-emp-search');
    const deptSelect = container.querySelector('#admin-emp-dept-filter');
    const tbody = container.querySelector('#admin-emp-table-body');

    const filterEmployees = () => {
      const query = searchInput.value.toLowerCase().trim();
      const dept = deptSelect.value;
      const filtered = allUsers.filter(u => {
        const matchQuery = !query || u.name.toLowerCase().includes(query) || u.id.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
        const matchDept = !dept || u.department === dept;
        return matchQuery && matchDept;
      });
      if (cardsContainer) cardsContainer.innerHTML = Dashboard.renderEmpCards(filtered);
      if (tbody) tbody.innerHTML = Dashboard.renderEmpRows(filtered);
      Dashboard.bindEmpRowEvents(container, onNavigate);
    };

    searchInput?.addEventListener('input', filterEmployees);
    deptSelect?.addEventListener('change', filterEmployees);

    // Navigation & Modal triggers
    document.getElementById('card-admin-pending')?.addEventListener('click', () => onNavigate('leave'));
    document.getElementById('card-admin-payroll')?.addEventListener('click', () => onNavigate('payroll'));

    document.getElementById('btn-admin-add-emp')?.addEventListener('click', () => {
      const modal = document.getElementById('modal-add-employee');
      if (modal) modal.classList.add('active');
    });

    Dashboard.bindEmpRowEvents(container, onNavigate);
  }

  static getEmpStatus(empId) {
    const today = new Date().toISOString().split('T')[0];
    const allAttendance = db.getAttendance();
    const allLeaves = db.getLeaves();

    const isOnLeave = allLeaves.some(l => 
      l.userId && l.userId.toLowerCase() === empId.toLowerCase() && 
      l.status === 'Approved' && 
      l.startDate <= today && today <= l.endDate
    );
    if (isOnLeave) {
      return { icon: '✈️', label: 'On Leave', bg: 'rgba(59, 130, 246, 0.25)', border: '#3b82f6' };
    }

    const att = allAttendance.find(a => a.userId && a.userId.toLowerCase() === empId.toLowerCase() && a.date === today);
    if (att && (att.status === 'Present' || (att.checkIn && att.checkIn !== '-'))) {
      return { icon: '🟢', label: 'Present in Office', bg: 'rgba(16, 185, 129, 0.25)', border: '#10b981' };
    }

    return { icon: '🟡', label: 'Absent Today', bg: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b' };
  }

  static renderEmpCards(usersList) {
    if (usersList.length === 0) {
      return '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">No matching employees found.</div>';
    }

    return usersList.map(emp => {
      const st = Dashboard.getEmpStatus(emp.id);
      return `
        <div class="emp-card-item" data-id="${emp.id}" style="position: relative; background: var(--bg-surface-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; transition: all 0.25s ease; box-shadow: var(--shadow-sm);">
          <!-- Top Right Work Status Icon (Image 2 Wireframe Spec) -->
          <div title="Work Status: ${st.label}" style="position: absolute; top: 12px; right: 12px; font-size: 1rem; width: 28px; height: 28px; border-radius: 50%; background: ${st.bg}; border: 1px solid ${st.border}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            ${st.icon}
          </div>

          <img src="${emp.avatar}" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-light); margin-bottom: 0.65rem;" />
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.15rem;">${emp.name}</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">${emp.position}</p>
          <code style="font-size: 0.75rem; color: var(--primary-accent); font-weight: 700; background: var(--bg-surface); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); margin-bottom: 0.65rem;">${emp.id}</code>
          
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted); padding-top: 0.65rem; border-top: 1px solid var(--border-color); margin-top: auto;">
            <span>${emp.department}</span>
            <span class="role-badge ${emp.role}">${emp.role.toUpperCase()}</span>
          </div>

          <div style="display: flex; gap: 0.35rem; width: 100%; margin-top: 0.75rem;" onclick="event.stopPropagation();">
            <button class="btn btn-secondary btn-sm btn-inspect-user" data-id="${emp.id}" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.75rem;">
              Manage
            </button>
            ${emp.role !== 'admin' ? `
              <button class="btn btn-danger btn-sm btn-delete-user" data-id="${emp.id}" data-name="${emp.name}" style="padding: 0.35rem 0.5rem; font-size: 0.75rem;">
                🗑️
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  static renderEmpRows(usersList) {
    if (usersList.length === 0) {
      return '<tr><td colspan="6" style="text-align: center; padding: 1.5rem;">No matching employees found.</td></tr>';
    }

    return usersList.map(emp => {
      const st = Dashboard.getEmpStatus(emp.id);
      return `
        <tr class="emp-row-item" data-id="${emp.id}" style="cursor: pointer;">
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="${emp.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary-light);" />
              <div>
                <strong>${emp.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${emp.email}</div>
              </div>
            </div>
          </td>
          <td><code style="font-size: 0.85rem; font-weight: 700; color: var(--primary-accent);">${emp.id}</code></td>
          <td>${emp.department}</td>
          <td>${emp.position}</td>
          <td><span title="${st.label}">${st.icon} ${st.label}</span></td>
          <td onclick="event.stopPropagation();">
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-sm btn-inspect-user" data-id="${emp.id}" title="Manage Profile">
                Manage
              </button>
              ${emp.role !== 'admin' ? `
                <button class="btn btn-danger btn-sm btn-delete-user" data-id="${emp.id}" data-name="${emp.name}" title="Delete Employee from Database">
                  🗑️ Delete
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  static bindEmpRowEvents(container, onNavigate) {
    // Click on card or row -> open employee profile
    container.querySelectorAll('.emp-card-item, .emp-row-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const empId = e.currentTarget.getAttribute('data-id');
        onNavigate('profile', empId);
      });
    });

    container.querySelectorAll('.btn-inspect-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const empId = e.currentTarget.getAttribute('data-id');
        onNavigate('profile', empId);
      });
    });

    container.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const empId = e.currentTarget.getAttribute('data-id');
        const empName = e.currentTarget.getAttribute('data-name');
        if (confirm(`Are you sure you want to delete employee '${empName}' (${empId}) from the database?`)) {
          db.deleteUser(empId);
          if (window.AppShowToast) window.AppShowToast(`Employee '${empName}' (${empId}) deleted from database.`, 'warning');
          onNavigate('dashboard');
        }
      });
    });
  }
}
