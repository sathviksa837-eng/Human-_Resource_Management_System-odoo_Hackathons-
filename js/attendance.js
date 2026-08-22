/* Dayflow HRMS - Attendance Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Attendance {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();

    const today = new Date().toISOString().split('T')[0];
    const userAttendance = db.getUserAttendance(user.id);
    const todayRecord = userAttendance.find(a => a.date === today);

    const isCheckedIn = todayRecord && todayRecord.checkIn !== '-' && todayRecord.checkOut === '-';

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">Attendance Management</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Track daily work hours, check-in status, and weekly attendance logs.</p>
        </div>
      </div>

      <!-- Live Check In Card -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 700;">Daily Shift Punch (${today})</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Record your daily attendance punches in real time.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="text-align: right;">
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">CURRENT STATUS</span>
              <span class="badge badge-${todayRecord ? todayRecord.status.toLowerCase().replace('-', '') : 'absent'}">
                ${todayRecord ? todayRecord.status : 'Not Checked In'}
              </span>
            </div>
            <button class="btn btn-primary" id="btn-toggle-checkin">
              ${isCheckedIn ? 'Punch Out (Check Out)' : 'Punch In (Check In)'}
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance Records List -->
      <div class="card">
        <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
          <h3 class="card-title">${isAdmin ? 'Organization Attendance Log' : 'My Attendance History'}</h3>
          ${isAdmin ? `
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              <input type="text" id="att-search-name" class="form-control" placeholder="Search employee..." style="width: 180px; padding: 0.35rem 0.6rem; font-size: 0.825rem;" />
              <select id="att-filter-status" class="form-control" style="width: 140px; padding: 0.35rem 0.6rem; font-size: 0.825rem;">
                <option value="">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Half-day">Half-day</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
              <button class="btn btn-secondary btn-sm" id="btn-manual-attendance">
                + Mark Attendance
              </button>
            </div>
          ` : ''}
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                ${isAdmin ? '<th>Employee</th>' : ''}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Work Hours</th>
                <th>Status</th>
                ${isAdmin ? '<th>Action</th>' : ''}
              </tr>
            </thead>
            <tbody id="attendance-table-body">
              ${Attendance.renderAttendanceRows(isAdmin ? db.getAttendance() : userAttendance, isAdmin, user)}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Filter Logic for Admin
    if (isAdmin) {
      const nameInput = container.querySelector('#att-search-name');
      const statusSelect = container.querySelector('#att-filter-status');
      const tbody = container.querySelector('#attendance-table-body');

      const filterAttendance = () => {
        const query = nameInput.value.toLowerCase().trim();
        const status = statusSelect.value;
        const allAtt = db.getAttendance();

        const filtered = allAtt.filter(att => {
          const emp = db.getUserById(att.userId);
          const empName = emp ? emp.name.toLowerCase() : '';
          const matchQuery = !query || empName.includes(query) || att.userId.toLowerCase().includes(query);
          const matchStatus = !status || att.status === status;
          return matchQuery && matchStatus;
        });

        tbody.innerHTML = Attendance.renderAttendanceRows(filtered, true, user);
        Attendance.bindAdminRowEvents(tbody, container, showToast);
      };

      nameInput?.addEventListener('input', filterAttendance);
      statusSelect?.addEventListener('change', filterAttendance);
    }

    // Attach Check In / Out Trigger
    container.querySelector('#btn-toggle-checkin')?.addEventListener('click', () => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!todayRecord) {
        // Create check in
        const newRecord = {
          id: 'att-' + Date.now(),
          userId: user.id,
          date: today,
          checkIn: nowTime,
          checkOut: '-',
          workHours: 'In Progress',
          status: 'Present'
        };
        db.addAttendanceRecord(newRecord);
        showToast(`Successfully checked in at ${nowTime}`, 'success');
        Attendance.render(container, showToast);
      } else if (todayRecord && todayRecord.checkOut === '-') {
        // Perform check out
        todayRecord.checkOut = nowTime;
        todayRecord.workHours = '8h 00m'; // Standard calculation simulation
        db.updateAttendanceRecord(todayRecord);
        showToast(`Successfully checked out at ${nowTime}`, 'success');
        Attendance.render(container, showToast);
      } else {
        showToast('You have already completed check-in and check-out for today.', 'warning');
      }
    });

    if (isAdmin) {
      Attendance.bindAdminRowEvents(container.querySelector('#attendance-table-body'), container, showToast);
      
      container.querySelector('#btn-manual-attendance')?.addEventListener('click', () => {
        const empId = prompt('Enter Employee ID (e.g., EMP-002):');
        if (!empId) return;
        const emp = db.getUserById(empId);
        if (!emp) {
          showToast('Employee ID not found.', 'danger');
          return;
        }
        const status = prompt('Enter status (Present, Absent, Half-day, Leave):', 'Present');
        if (status) {
          const record = {
            id: 'att-' + Date.now(),
            userId: empId,
            date: today,
            checkIn: '09:00 AM',
            checkOut: '05:00 PM',
            workHours: '8h 00m',
            status
          };
          db.addAttendanceRecord(record);
          showToast(`Marked attendance for ${emp.name}`, 'success');
          Attendance.render(container, showToast);
        }
      });
    }
  }

  static renderAttendanceRows(list, isAdmin, user) {
    if (list.length === 0) {
      return `<tr><td colspan="${isAdmin ? 7 : 5}" style="text-align: center; padding: 1.5rem;">No attendance records found.</td></tr>`;
    }

    return list.map(att => {
      const emp = isAdmin ? db.getUserById(att.userId) : user;
      return `
        <tr>
          ${isAdmin ? `
            <td>
              <strong>${emp ? emp.name : att.userId}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${att.userId}</div>
            </td>
          ` : ''}
          <td><strong>${att.date}</strong></td>
          <td>${att.checkIn}</td>
          <td>${att.checkOut}</td>
          <td>${att.workHours}</td>
          <td><span class="badge badge-${att.status.toLowerCase().replace('-', '')}">${att.status}</span></td>
          ${isAdmin ? `
            <td>
              <button class="btn btn-secondary btn-sm btn-edit-att" data-id="${att.id}">
                Edit Log
              </button>
            </td>
          ` : ''}
        </tr>
      `;
    }).join('');
  }

  static bindAdminRowEvents(tbody, container, showToast) {
    tbody.querySelectorAll('.btn-edit-att').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const attId = e.currentTarget.getAttribute('data-id');
        const att = db.getAttendance().find(a => a.id === attId);
        if (att) {
          const newStatus = prompt('Enter new status (Present, Absent, Half-day, Leave):', att.status);
          if (newStatus && ['Present', 'Absent', 'Half-day', 'Leave'].includes(newStatus)) {
            att.status = newStatus;
            db.updateAttendanceRecord(att);
            showToast('Attendance status updated!', 'success');
            Attendance.render(container, showToast);
          }
        }
      });
    });
  }
}
