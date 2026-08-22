/* Dayflow HRMS - Attendance Module */
import { db, formatTime12h, calculateWorkHours } from './db.js';
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
      const nowTime = formatTime12h(new Date());
      
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
        todayRecord.workHours = calculateWorkHours(todayRecord.checkIn, nowTime);
        db.updateAttendanceRecord(todayRecord);
        showToast(`Successfully checked out at ${nowTime}! Work Hours: ${todayRecord.workHours}`, 'success');
        Attendance.render(container, showToast);
      } else {
        showToast('You have already completed check-in and check-out for today.', 'warning');
      }
    });

    if (isAdmin) {
      Attendance.bindAdminRowEvents(container.querySelector('#attendance-table-body'), container, showToast);
      
      container.querySelector('#btn-manual-attendance')?.addEventListener('click', () => {
        Attendance.openMarkModal(container, showToast);
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
          Attendance.openEditModal(att, container, showToast);
        }
      });
    });
  }

  static openEditModal(att, container, showToast) {
    const modal = document.getElementById('modal-edit-attendance');
    if (!modal) return;

    const emp = db.getUserById(att.userId);
    const empInfoInput = modal.querySelector('#edit-att-emp-info');
    const attIdInput = modal.querySelector('#edit-att-id');
    const dateInput = modal.querySelector('#edit-att-date');
    const statusSelect = modal.querySelector('#edit-att-status');
    const checkinInput = modal.querySelector('#edit-att-checkin');
    const checkoutInput = modal.querySelector('#edit-att-checkout');

    if (empInfoInput) empInfoInput.value = `${emp ? emp.name : att.userId} (${att.userId})`;
    if (attIdInput) attIdInput.value = att.id;
    if (dateInput) dateInput.value = att.date;
    if (statusSelect) statusSelect.value = att.status;
    if (checkinInput) checkinInput.value = att.checkIn || '09:00 AM';
    if (checkoutInput) checkoutInput.value = att.checkOut || '05:00 PM';

    modal.classList.add('active');

    const closeModal = () => modal.classList.remove('active');
    
    // Clean listener attachment
    const btnClose = modal.querySelector('#btn-close-edit-att-modal');
    const btnCancel = modal.querySelector('#btn-cancel-edit-att');
    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    const form = modal.querySelector('#form-edit-attendance');
    if (form) {
      form.onsubmit = (evt) => {
        evt.preventDefault();
        att.date = dateInput.value;
        att.status = statusSelect.value;
        att.checkIn = checkinInput.value;
        att.checkOut = checkoutInput.value;
        if (att.checkIn !== '-' && att.checkOut !== '-') {
          att.workHours = calculateWorkHours(att.checkIn, att.checkOut);
        }
        db.updateAttendanceRecord(att);
        closeModal();
        showToast('Attendance log updated successfully!', 'success');
        Attendance.render(container, showToast);
      };
    }
  }

  static openMarkModal(container, showToast) {
    const modal = document.getElementById('modal-mark-attendance');
    if (!modal) return;

    const userSelect = modal.querySelector('#mark-att-user-id');
    const dateInput = modal.querySelector('#mark-att-date');
    const statusSelect = modal.querySelector('#mark-att-status');
    const checkinInput = modal.querySelector('#mark-att-checkin');
    const checkoutInput = modal.querySelector('#mark-att-checkout');

    if (userSelect) {
      const employees = db.getUsers().filter(u => u.role === 'employee' || u.role === 'admin');
      userSelect.innerHTML = employees.map(emp => `<option value="${emp.id}">${emp.name} (${emp.id}) - ${emp.department || 'Operations'}</option>`).join('');
    }
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    modal.classList.add('active');

    const closeModal = () => modal.classList.remove('active');
    const btnClose = modal.querySelector('#btn-close-mark-att-modal');
    const btnCancel = modal.querySelector('#btn-cancel-mark-att');
    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    const form = modal.querySelector('#form-mark-attendance');
    if (form) {
      form.onsubmit = (evt) => {
        evt.preventDefault();
        const selectedUserId = userSelect.value;
        const emp = db.getUserById(selectedUserId);
        const record = {
          id: 'att-' + Date.now(),
          userId: selectedUserId,
          date: dateInput.value,
          checkIn: checkinInput.value,
          checkOut: checkoutInput.value,
          workHours: calculateWorkHours(checkinInput.value, checkoutInput.value),
          status: statusSelect.value
        };
        db.addAttendanceRecord(record);
        closeModal();
        showToast(`Marked attendance entry for ${emp ? emp.name : selectedUserId}`, 'success');
        Attendance.render(container, showToast);
      };
    }
  }
}
