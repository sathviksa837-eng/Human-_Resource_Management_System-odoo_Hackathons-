/* Dayflow HRMS - Leave Management Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Leave {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();

    const userLeaves = db.getUserLeaves(user.id);
    const allLeaves = db.getLeaves();

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">Leave & Time-Off Management</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Submit leave applications, track status, and manage approval requests.</p>
        </div>
        <button class="btn btn-primary" id="btn-open-leave-modal">
          + Request Time Off
        </button>
      </div>

      <!-- Balance Overview Cards -->
      <div class="grid-stats" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div class="stat-details">
            <p>Paid Leave Balance</p>
            <h3>${user.leaveBalance ? user.leaveBalance.paid : 15} Days</h3>
            <p style="color: var(--accent); margin-top: 0.25rem;">Annual paid quota</p>
          </div>
          <div class="stat-icon primary">🌴</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Sick Leave Balance</p>
            <h3>${user.leaveBalance ? user.leaveBalance.sick : 8} Days</h3>
            <p style="color: var(--status-present); margin-top: 0.25rem;">Medical leave</p>
          </div>
          <div class="stat-icon success">🏥</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Casual Leave Balance</p>
            <h3>${user.leaveBalance ? user.leaveBalance.casual : 5} Days</h3>
            <p style="color: var(--status-halfday); margin-top: 0.25rem;">Emergency quota</p>
          </div>
          <div class="stat-icon warning">📅</div>
        </div>
      </div>

      <!-- Leave Requests List -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${isAdmin ? 'All Employee Leave Applications' : 'My Leave History'}</h3>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                ${isAdmin ? '<th>Employee</th>' : ''}
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>HR Comments</th>
                ${isAdmin ? '<th>Action</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${(isAdmin ? allLeaves : userLeaves).map(l => `
                <tr>
                  ${isAdmin ? `
                    <td>
                      <strong>${l.userName || l.userId}</strong>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">${l.userId}</div>
                    </td>
                  ` : ''}
                  <td><strong>${l.leaveType}</strong></td>
                  <td>${l.startDate} to ${l.endDate}</td>
                  <td>${l.totalDays} day(s)</td>
                  <td>${l.reason}</td>
                  <td>${l.appliedOn}</td>
                  <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
                  <td><em style="color: var(--text-muted); font-size: 0.825rem;">${l.comments || '—'}</em></td>
                  ${isAdmin ? `
                    <td>
                      ${l.status === 'Pending' ? `
                        <div style="display: flex; gap: 0.35rem;">
                          <button class="btn btn-success btn-sm btn-approve-leave" data-id="${l.id}">Approve</button>
                          <button class="btn btn-danger btn-sm btn-reject-leave" data-id="${l.id}">Reject</button>
                        </div>
                      ` : '<span style="font-size: 0.8rem; color: var(--text-muted);">Resolved</span>'}
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
              ${(isAdmin ? allLeaves : userLeaves).length === 0 ? '<tr><td colspan="8" style="text-align:center; padding: 1.5rem;">No leave requests found.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Apply Leave Modal -->
      <div class="modal-overlay" id="modal-leave-application">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Apply for Time Off</h3>
            <button class="btn btn-secondary btn-sm" id="btn-close-leave-modal">✕</button>
          </div>
          <form id="form-apply-leave">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Leave Type</label>
                <select class="form-control" name="leaveType" required>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input type="date" class="form-control" name="startDate" required />
                </div>
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input type="date" class="form-control" name="endDate" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Reason / Remarks</label>
                <textarea class="form-control" name="reason" rows="3" placeholder="Provide details regarding your time off request..." required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="btn-cancel-leave-modal">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Application</button>
            </div>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Modal Triggers
    const modal = container.querySelector('#modal-leave-application');
    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    container.querySelector('#btn-open-leave-modal')?.addEventListener('click', openModal);
    container.querySelector('#btn-close-leave-modal')?.addEventListener('click', closeModal);
    container.querySelector('#btn-cancel-leave-modal')?.addEventListener('click', closeModal);

    // Leave Submission
    const form = container.querySelector('#form-apply-leave');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const start = new Date(formData.get('startDate'));
      const end = new Date(formData.get('endDate'));

      if (end < start) {
        showToast('End date cannot be prior to start date.', 'danger');
        return;
      }

      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const leaveType = formData.get('leaveType');
      const newLeave = {
        id: 'LV-' + Math.floor(100 + Math.random() * 900),
        userId: user.id,
        userName: user.name,
        leaveType,
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        totalDays: diffDays,
        reason: formData.get('reason'),
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
        comments: ''
      };

      db.addLeave(newLeave);
      closeModal();
      showToast('Leave request submitted successfully!', 'success');
      Leave.render(container, showToast);
    });

    // HR Approval & Rejection Logic
    if (isAdmin) {
      container.querySelectorAll('.btn-approve-leave').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const comment = prompt('Add optional HR approval note:', 'Approved by HR Administrator.');
          db.updateLeaveStatus(id, 'Approved', comment || 'Approved.');
          showToast('Leave request approved & quota updated!', 'success');
          Leave.render(container, showToast);
        });
      });

      container.querySelectorAll('.btn-reject-leave').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const comment = prompt('Add HR rejection reason:', 'Requires schedule re-alignment.');
          db.updateLeaveStatus(id, 'Rejected', comment || 'Rejected.');
          showToast('Leave request rejected.', 'warning');
          Leave.render(container, showToast);
        });
      });
    }
  }
}
