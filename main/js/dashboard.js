/* Dayflow HRMS - Apple-Inspired Dashboard Module */
import { db, generateEmployeeID, calculateProRatedSalary } from './db.js';
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
      <!-- Welcome Hero Banner -->
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3">
              <span>💼 Employee Portal • ID: ${user.id}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-black tracking-tight mb-1">Welcome back, ${user.name}!</h1>
            <p class="text-emerald-100 text-sm font-medium">${user.position} • ${user.department}</p>
          </div>

          <!-- Live Shift Timer Widget -->
          <div class="bg-black/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center md:text-right min-w-[220px]">
            <p class="text-xs text-emerald-100 font-semibold uppercase tracking-wider mb-1">Live Shift Timer</p>
            <div class="text-3xl font-mono font-black text-white" id="dash-timer">00:00:00</div>
            <button id="dash-checkin-btn" class="mt-3 w-full py-2 px-4 rounded-xl ${isCheckedIn ? 'bg-amber-500 hover:bg-amber-600' : 'bg-white text-emerald-700 hover:bg-emerald-50'} font-bold text-xs transition-all apple-btn-press shadow-md">
              ${isCheckedIn ? '⏱️ Punch Out (Check Out)' : '⚡ Punch In (Check In)'}
            </button>
          </div>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div id="card-nav-profile" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>My Profile</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono">ID</span>
            </div>
            <div class="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-50">${user.id}</div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>View Info</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-nav-attendance" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Attendance Record</span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">+96.4%</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">${userAttendance.filter(a => a.status === 'Present').length} <span class="text-sm font-semibold text-zinc-400">Days</span></div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Present This Month</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-nav-leave" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Leave Requests</span>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">${pendingLeaves} Pending</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">${user.leaveBalance ? user.leaveBalance.paid : 15} <span class="text-sm font-semibold text-zinc-400">Days Left</span></div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>Paid Leave Balance</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-nav-payroll" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Monthly Net Pay</span>
              <span class="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">Pro-rated</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">$${(user.salary.basic + user.salary.hra + user.salary.allowances - user.salary.deductions).toLocaleString()}</div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
            <span>View Pay Slips</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Recent Attendance Table -->
      <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Attendance Activity</h2>
          <button id="btn-dash-view-att" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">View Log →</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-zinc-200/80 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th class="py-2.5 px-3">Date</th>
                <th class="py-2.5 px-3">Check IN</th>
                <th class="py-2.5 px-3">Check OUT</th>
                <th class="py-2.5 px-3">Work Hours</th>
                <th class="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              ${userAttendance.slice(0, 5).map(att => `
                <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td class="py-3 px-3 font-bold text-zinc-900 dark:text-zinc-100">${att.date}</td>
                  <td class="py-3 px-3 text-zinc-600 dark:text-zinc-300 font-mono text-xs">${att.checkIn}</td>
                  <td class="py-3 px-3 text-zinc-600 dark:text-zinc-300 font-mono text-xs">${att.checkOut}</td>
                  <td class="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 text-xs">${att.workHours}</td>
                  <td class="py-3 px-3">
                    <span class="px-2.5 py-0.5 rounded-md text-xs font-bold ${att.status === 'Present' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}">
                      ${att.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
              ${userAttendance.length === 0 ? '<tr><td colspan="5" class="text-center py-6 text-zinc-400">No attendance records recorded yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Start Live Shift Timer
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
    }

    // Bind navigation clicks
    document.getElementById('card-nav-profile')?.addEventListener('click', () => onNavigate('profile'));
    document.getElementById('card-nav-attendance')?.addEventListener('click', () => onNavigate('attendance'));
    document.getElementById('card-nav-leave')?.addEventListener('click', () => onNavigate('leave'));
    document.getElementById('card-nav-payroll')?.addEventListener('click', () => onNavigate('payroll'));
    document.getElementById('btn-dash-view-att')?.addEventListener('click', () => onNavigate('attendance'));
    document.getElementById('dash-checkin-btn')?.addEventListener('click', () => onNavigate('attendance'));
  }

  static renderAdminDashboard(container, user, onNavigate) {
    const currentHrId = user.hrId || 1;
    const allHrs = db.getHRs();
    const activeHrObj = db.getHRById(currentHrId) || allHrs[0];

    const approvedUsers = db.getApprovedUsers(currentHrId);
    const pendingUsers = db.getPendingUsers(currentHrId);
    const allAttendance = db.getAttendance();
    const allLeaves = db.getLeaves();

    const today = new Date().toISOString().split('T')[0];
    const presentToday = allAttendance.filter(a => a.date === today && a.status === 'Present').length;
    const pendingLeaves = allLeaves.filter(l => l.status === 'Pending').length;

    let totalMonthlyPayroll = 0;
    approvedUsers.forEach(u => {
      const calc = calculateProRatedSalary(u);
      totalMonthlyPayroll += calc.finalNetSalary;
    });

    const html = `
      <!-- Admin Header Block -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>🛡️ ${activeHrObj.department} HR Command Center</span>
          </div>
          <h1 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">${activeHrObj.name} Portal</h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Managing ${approvedUsers.length} assigned team members & candidate applications for ${activeHrObj.department}.</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold border border-zinc-200 dark:border-zinc-700">
            ${activeHrObj.name} (${activeHrObj.hrCode})
          </span>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div id="card-admin-workforce" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Assigned Workforce</span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">+12.4%</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">${approvedUsers.length} <span class="text-sm font-semibold text-zinc-400">Staff</span></div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Under ${activeHrObj.name}</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-admin-attendance" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Present Today</span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">Live</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">${presentToday} <span class="text-sm font-semibold text-zinc-400">On Duty</span></div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>Attendance Log</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-admin-pending" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Pending Approvals</span>
              <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px] font-bold">Action Needed</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">${pendingLeaves} <span class="text-sm font-semibold text-zinc-400">Requests</span></div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
            <span>Review Time Off</span>
            <span>→</span>
          </div>
        </div>

        <div id="card-admin-payroll" class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift cursor-pointer flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Team Payroll</span>
              <span class="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 text-[10px] font-bold">Monthly</span>
            </div>
            <div class="text-3xl font-black text-zinc-900 dark:text-zinc-50">$${totalMonthlyPayroll.toLocaleString()}</div>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
            <span>Payroll Engine</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Pending Applicants Section -->
      <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">Candidate Applications</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Sign-up requests assigned to ${activeHrObj.name} for review.</p>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold">${pendingUsers.length} Pending</span>
        </div>

        ${pendingUsers.length === 0 ? `
          <div class="text-center py-8 text-zinc-400 text-sm">
            ✅ All candidate applications have been processed for ${activeHrObj.name}!
          </div>
        ` : `
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-zinc-200/80 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <th class="py-2.5 px-3">Applicant</th>
                  <th class="py-2.5 px-3">Contact</th>
                  <th class="py-2.5 px-3">Department</th>
                  <th class="py-2.5 px-3">Applied Date</th>
                  <th class="py-2.5 px-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                ${pendingUsers.map(app => `
                  <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-3">
                        <img src="${app.avatar}" class="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                        <div>
                          <div class="font-bold text-zinc-900 dark:text-zinc-100">${app.name}</div>
                          <div class="text-xs text-zinc-400">${app.position}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-xs text-zinc-600 dark:text-zinc-300">${app.email}</td>
                    <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold">${app.department}</span></td>
                    <td class="py-3 px-3 text-xs text-zinc-400">${app.appliedDate || app.joinDate}</td>
                    <td class="py-3 px-3 text-right">
                      <button class="btn-approve-applicant px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all apple-btn-press" data-email="${app.email}" data-name="${app.name}">
                        Approve & Issue ID
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    container.innerHTML = html;

    // Attach listeners
    document.getElementById('card-admin-workforce')?.addEventListener('click', () => onNavigate('directory'));
    document.getElementById('card-admin-attendance')?.addEventListener('click', () => onNavigate('attendance'));
    document.getElementById('card-admin-pending')?.addEventListener('click', () => onNavigate('leave'));
    document.getElementById('card-admin-payroll')?.addEventListener('click', () => onNavigate('payroll'));

    // Applicant approval listener
    container.querySelectorAll('.btn-approve-applicant').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        const name = e.currentTarget.getAttribute('data-name');
        const updatedUser = db.approveUser(email);
        if (updatedUser) {
          window.AppShowToast(`Approved ${name}! Issued ID: ${updatedUser.id}`, 'success');
          Dashboard.render(container, onNavigate, user);
        }
      });
    });
  }
}
