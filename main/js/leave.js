/* Dayflow HRMS - Leave & Time Off Module (Clean, Spacious 12-Month & Month View) */
import { db } from './db.js';
import { Auth } from './auth.js';

const PUBLIC_HOLIDAYS_2026 = [
  { date: '2026-01-14', title: 'Kite Festival' },
  { date: '2026-01-26', title: 'Republic Day' },
  { date: '2026-03-04', title: 'Dhuleti' },
  { date: '2026-08-15', title: 'Independence Day' },
  { date: '2026-08-28', title: 'Raksha Bandhan' },
  { date: '2026-10-02', title: 'Gandhi Jayanti' },
  { date: '2026-11-08', title: 'Diwali' },
  { date: '2026-11-10', title: 'New Year' },
  { date: '2026-11-11', title: 'Bhai Dooj' }
];

export class Leave {
  static currentViewMode = 'year'; // 'year' or 'month'
  static selectedMonthIdx = 7; // August default

  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();

    const userLeaves = db.getUserLeaves(user.id);
    const allLeaves = db.getLeaves();

    const paidBalance = user.leaveBalance ? user.leaveBalance.paid : 24;
    const sickBalance = user.leaveBalance ? user.leaveBalance.sick : 7;

    const monthNames = [
      'January 2026', 'February 2026', 'March 2026', 'April 2026',
      'May 2026', 'June 2026', 'July 2026', 'August 2026',
      'September 2026', 'October 2026', 'November 2026', 'December 2026'
    ];

    const html = `
      <!-- Top Title & Action Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 0.6rem;">
            <span>Time Off & Leave Calendar</span>
          </h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
            12-Month Calendar Overview, Public Holidays, and Time Off Allocation Requests.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <!-- View Switcher Toggle (Year View / Focused Month View) -->
          <div style="background: var(--bg-surface-secondary); padding: 0.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; gap: 0.25rem;">
            <button class="btn btn-sm ${Leave.currentViewMode === 'year' ? 'btn-purple' : 'btn-secondary'}" id="btn-toggle-year-view" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
              🗓️ 12-Month Grid
            </button>
            <button class="btn btn-sm ${Leave.currentViewMode === 'month' ? 'btn-purple' : 'btn-secondary'}" id="btn-toggle-month-view" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
              📅 Month Focus
            </button>
          </div>

          <button class="btn btn-purple btn-wireframe-purple" id="btn-open-new-timeoff" style="font-weight: 800; font-size: 0.95rem; padding: 0.5rem 1.25rem; box-shadow: var(--shadow-md);">
            NEW
          </button>
        </div>
      </div>

      <!-- Balance Cards Banner & Horizontal Legend Bar -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem; align-items: center;">
        
        <!-- Leave Balances -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
          <div style="background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary-accent); text-transform: uppercase; letter-spacing: 0.04em;">Paid Time Off</span>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0.1rem 0 0 0;">${paidBalance} Days</h3>
            </div>
            <div style="font-size: 1.8rem; opacity: 0.85;">🌴</div>
          </div>

          <div style="background: var(--bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-sm);">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.04em;">Sick Time Off</span>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0.1rem 0 0 0;">0${sickBalance} Days</h3>
            </div>
            <div style="font-size: 1.8rem; opacity: 0.85;">🏥</div>
          </div>
        </div>

        <!-- Legend Pill Card -->
        <div style="background: var(--bg-surface); padding: 0.85rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.4rem;">Legend Indicator</span>
          <div style="display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; font-size: 0.8rem;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #7c3aed; display: inline-block;"></span><strong>Validated</strong></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; height: 12px; border-radius: 50%; border: 2px dashed #f59e0b; background: rgba(245, 158, 11, 0.2); display: inline-block;"></span><strong>To Approve</strong></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; display: inline-block;"></span><strong>Refused</strong></span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; display: inline-block;"></span><strong>Public Holiday</strong></span>
          </div>
        </div>
      </div>

      <!-- Calendar & Sidebar Container -->
      <div style="display: grid; grid-template-columns: 3.2fr 1fr; gap: 1.5rem; margin-bottom: 1.75rem;">
        
        <!-- Main Calendar Surface -->
        <div class="card" style="padding: 1.25rem;">
          ${Leave.currentViewMode === 'year' ? `
            <!-- 12-Month Responsive Grid (Clean 4 Columns on Wide Screens) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
              ${monthNames.map((mName, mIdx) => Leave.renderCleanMiniMonth(2026, mIdx, mName, userLeaves)).join('')}
            </div>
          ` : `
            <!-- Focused Large Month View -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-accent); margin: 0;">
                  ${monthNames[Leave.selectedMonthIdx]}
                </h3>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" id="btn-prev-month">◀ Prev Month</button>
                  <button class="btn btn-secondary btn-sm" id="btn-next-month">Next Month ▶</button>
                </div>
              </div>

              ${Leave.renderLargeFocusedMonth(2026, Leave.selectedMonthIdx, userLeaves)}
            </div>
          `}
        </div>

        <!-- Sidebar: Public Holidays List -->
        <div class="card" style="padding: 1.25rem; display: flex; flex-direction: column;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
            Public Holidays (2026)
          </h4>

          <div style="display: flex; flex-direction: column; gap: 0.65rem; overflow-y: auto; max-height: 520px; padding-right: 0.25rem;">
            ${PUBLIC_HOLIDAYS_2026.map(h => {
              const dObj = new Date(h.date);
              const dayNum = String(dObj.getDate()).padStart(2, '0');
              const monthStr = dObj.toLocaleDateString('en-US', { month: 'short' });
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                  <div style="display: flex; align-items: center; gap: 0.65rem;">
                    <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 800; font-family: monospace;">
                      ${monthStr} ${dayNum}
                    </span>
                    <strong style="font-size: 0.825rem; color: var(--text-main);">${h.title}</strong>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Time Off Applications History & HR Approval Queue Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${isAdmin ? 'HR Command: All Employee Time Off Requests' : 'My Time Off Requests History'}</h3>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                ${isAdmin ? '<th>Employee</th>' : ''}
                <th>Time Off Type</th>
                <th>Validity Period</th>
                <th>Allocation (Days)</th>
                <th>Reason / Certificate</th>
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
                  <td><code style="font-size: 0.85rem; font-weight: 700;">${String(l.totalDays).padStart(2, '0')}.00 Days</code></td>
                  <td>
                    <div>${l.reason || 'No remarks'}</div>
                    ${l.attachmentName ? `<span style="font-size: 0.75rem; color: var(--primary-accent);">📎 ${l.attachmentName}</span>` : ''}
                  </td>
                  <td>
                    <span class="badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Pending' ? 'badge-warning' : 'badge-danger'}">
                      ${l.status === 'Approved' ? 'Validated' : l.status === 'Pending' ? 'To Approve' : 'Refused'}
                    </span>
                  </td>
                  <td><em style="color: var(--text-muted); font-size: 0.8rem;">${l.comments || '—'}</em></td>
                  ${isAdmin ? `
                    <td>
                      ${l.status === 'Pending' ? `
                        <div style="display: flex; gap: 0.35rem;">
                          <button class="btn btn-purple btn-sm btn-approve-leave" data-id="${l.id}">Validate</button>
                          <button class="btn btn-danger btn-sm btn-reject-leave" data-id="${l.id}">Refuse</button>
                        </div>
                      ` : '<span style="font-size: 0.8rem; color: var(--text-muted);">Resolved</span>'}
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
              ${(isAdmin ? allLeaves : userLeaves).length === 0 ? '<tr><td colspan="8" style="text-align:center; padding: 1.5rem;">No time off requests found.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Time Off Type Request Modal (Matching Wireframe Spec) -->
      <div class="modal-overlay" id="modal-timeoff-request">
        <div class="modal" style="max-width: 540px; border-radius: var(--radius-lg);">
          <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 800;">Time off Type Request</h3>
            <button class="btn btn-secondary btn-sm" id="btn-close-timeoff-modal">✕</button>
          </div>
          
          <form id="form-timeoff-request">
            <div class="modal-body" style="padding: 1.25rem 0;">
              <!-- Employee Display -->
              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <label class="form-label" style="margin: 0; font-weight: 600;">Employee</label>
                <strong style="color: var(--primary-accent); font-size: 1rem;">[${user.name}]</strong>
              </div>

              <!-- Time off Type Dropdown -->
              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <label class="form-label" style="margin: 0; font-weight: 600;">Time off Type</label>
                <select class="form-control" name="leaveType" id="select-timeoff-type" style="width: 220px; font-weight: 700; color: var(--primary-accent);" required>
                  <option value="Paid time off">Paid time off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leaves">Unpaid Leaves</option>
                </select>
              </div>

              <!-- Validity Period -->
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" style="font-weight: 600; margin-bottom: 0.4rem;">Validity Period</label>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <input type="date" class="form-control" id="timeoff-start-date" name="startDate" required style="font-weight: 600;" />
                  <span style="font-weight: 700; color: var(--text-muted);">To</span>
                  <input type="date" class="form-control" id="timeoff-end-date" name="endDate" required style="font-weight: 600;" />
                </div>
              </div>

              <!-- Allocation Readout -->
              <div class="form-group" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; background: var(--bg-surface-secondary); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
                <label class="form-label" style="margin: 0; font-weight: 600;">Allocation</label>
                <strong id="timeoff-allocation-days" style="color: var(--primary-accent); font-size: 1.1rem; font-family: monospace;">01.00 Days</strong>
              </div>

              <!-- Attachment Upload -->
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Attachment:</label>
                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                  <button type="button" class="btn btn-secondary btn-sm" id="btn-trigger-upload-att">
                    📤 Upload Attachment
                  </button>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">(For sick leave certificate)</span>
                  <input type="file" id="timeoff-file-input" accept="image/*,.pdf" style="display: none;" />
                  <span id="timeoff-filename-display" style="font-size: 0.8rem; font-weight: 700; color: var(--status-present);"></span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-footer" style="border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
              <button type="submit" class="btn btn-purple" id="btn-submit-timeoff" style="font-weight: 700; padding: 0.4rem 1.25rem;">Submit</button>
              <button type="button" class="btn btn-secondary" id="btn-discard-timeoff">Discard</button>
            </div>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // View Switcher Handlers
    container.querySelector('#btn-toggle-year-view')?.addEventListener('click', () => {
      Leave.currentViewMode = 'year';
      Leave.render(container, showToast);
    });

    container.querySelector('#btn-toggle-month-view')?.addEventListener('click', () => {
      Leave.currentViewMode = 'month';
      Leave.render(container, showToast);
    });

    container.querySelector('#btn-prev-month')?.addEventListener('click', () => {
      if (Leave.selectedMonthIdx > 0) {
        Leave.selectedMonthIdx--;
        Leave.render(container, showToast);
      }
    });

    container.querySelector('#btn-next-month')?.addEventListener('click', () => {
      if (Leave.selectedMonthIdx < 11) {
        Leave.selectedMonthIdx++;
        Leave.render(container, showToast);
      }
    });

    // Modal Trigger Handlers
    const modal = container.querySelector('#modal-timeoff-request');
    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    container.querySelector('#btn-open-new-timeoff')?.addEventListener('click', openModal);
    container.querySelector('#btn-close-timeoff-modal')?.addEventListener('click', closeModal);
    container.querySelector('#btn-discard-timeoff')?.addEventListener('click', closeModal);

    // Live Allocation Calculator
    const startInput = container.querySelector('#timeoff-start-date');
    const endInput = container.querySelector('#timeoff-end-date');
    const allocDisplay = container.querySelector('#timeoff-allocation-days');

    const updateDaysAllocated = () => {
      if (!startInput.value || !endInput.value) {
        if (allocDisplay) allocDisplay.innerText = '01.00 Days';
        return;
      }
      const d1 = new Date(startInput.value);
      const d2 = new Date(endInput.value);
      if (d2 < d1) {
        if (allocDisplay) allocDisplay.innerText = '00.00 Days';
        return;
      }
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (allocDisplay) allocDisplay.innerText = `${String(diffDays).padStart(2, '0')}.00 Days`;
    };

    startInput?.addEventListener('change', updateDaysAllocated);
    endInput?.addEventListener('change', updateDaysAllocated);

    // File Attachment Handler
    let attachmentFileName = '';
    const fileInput = container.querySelector('#timeoff-file-input');
    const uploadBtn = container.querySelector('#btn-trigger-upload-att');
    const filenameDisplay = container.querySelector('#timeoff-filename-display');

    uploadBtn?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        attachmentFileName = e.target.files[0].name;
        if (filenameDisplay) filenameDisplay.innerText = `📎 ${attachmentFileName}`;
      }
    });

    // Submit Request Handler
    const form = container.querySelector('#form-timeoff-request');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const startDate = formData.get('startDate');
      const endDate = formData.get('endDate');

      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      if (d2 < d1) {
        if (showToast) showToast('End date cannot be prior to start date.', 'danger');
        return;
      }

      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const leaveType = formData.get('leaveType');
      const newLeave = {
        id: 'LV-' + Math.floor(100 + Math.random() * 900),
        userId: user.id,
        userName: user.name,
        leaveType,
        startDate,
        endDate,
        totalDays: diffDays,
        reason: `${leaveType} request for ${diffDays} day(s)`,
        status: 'Pending',
        appliedOn: new Date().toISOString().split('T')[0],
        comments: '',
        attachmentName: attachmentFileName
      };

      db.addLeave(newLeave);
      closeModal();
      if (showToast) showToast(`Time Off Request for ${diffDays} day(s) submitted! Marked as To Approve ⏳`, 'success');
      Leave.render(container, showToast);
    });

    // HR Actions
    if (isAdmin) {
      container.querySelectorAll('.btn-approve-leave').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          db.updateLeaveStatus(id, 'Approved', 'Validated by HR.');
          if (showToast) showToast('Time Off application Validated 🟪!', 'success');
          Leave.render(container, showToast);
        });
      });

      container.querySelectorAll('.btn-reject-leave').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          db.updateLeaveStatus(id, 'Rejected', 'Refused by HR.');
          if (showToast) showToast('Time Off application Refused 🔴.', 'warning');
          Leave.render(container, showToast);
        });
      });
    }
  }

  // Clean, Spacious Mini Month Generator
  static renderCleanMiniMonth(year, monthIdx, monthTitle, userLeaves) {
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const totalDays = new Date(year, monthIdx + 1, 0).getDate();

    let daysHTML = '';
    for (let i = 0; i < firstDay; i++) {
      daysHTML += '<div style="width: 24px; height: 24px;"></div>';
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const holiday = PUBLIC_HOLIDAYS_2026.find(h => h.date === dateStr);
      const activeLeave = userLeaves.find(l => l.startDate <= dateStr && dateStr <= l.endDate);

      let style = 'width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; border-radius: 50%; font-weight: 500; color: var(--text-main); font-family: monospace;';
      let titleAttr = '';

      if (holiday) {
        style += ' background: #10b981; color: white; font-weight: 800; box-shadow: 0 0 4px rgba(16, 185, 129, 0.5);';
        titleAttr = `title="Public Holiday: ${holiday.title}"`;
      } else if (activeLeave) {
        if (activeLeave.status === 'Approved') {
          style += ' background: #7c3aed; color: white; font-weight: 800; box-shadow: 0 0 6px rgba(124, 58, 237, 0.6);';
          titleAttr = `title="Validated: ${activeLeave.leaveType}"`;
        } else if (activeLeave.status === 'Pending') {
          style += ' border: 2px dashed #f59e0b; color: #f59e0b; font-weight: 800; background: rgba(245, 158, 11, 0.25);';
          titleAttr = `title="To Approve: ${activeLeave.leaveType}"`;
        } else if (activeLeave.status === 'Rejected') {
          style += ' background: #ef4444; color: white; font-weight: 800;';
          titleAttr = `title="Refused"`;
        }
      }

      daysHTML += `<div style="${style}" ${titleAttr}>${d}</div>`;
    }

    return `
      <div style="background: var(--bg-surface-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.75rem; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.85rem; font-weight: 800; color: var(--primary-accent); text-align: center; margin-bottom: 0.5rem; letter-spacing: 0.03em;">
          ${monthTitle.split(' ')[0]}
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); justify-items: center; font-size: 0.68rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); justify-items: center; row-gap: 4px;">
          ${daysHTML}
        </div>
      </div>
    `;
  }

  // Large Focused Month View Generator
  static renderLargeFocusedMonth(year, monthIdx, userLeaves) {
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const totalDays = new Date(year, monthIdx + 1, 0).getDate();

    let gridHTML = '';
    for (let i = 0; i < firstDay; i++) {
      gridHTML += '<div style="background: var(--bg-surface-secondary); opacity: 0.3; border-radius: var(--radius-md); min-height: 80px;"></div>';
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const holiday = PUBLIC_HOLIDAYS_2026.find(h => h.date === dateStr);
      const activeLeave = userLeaves.find(l => l.startDate <= dateStr && dateStr <= l.endDate);

      let borderStyle = '1px solid var(--border-color)';
      let bgStyle = 'var(--bg-surface-secondary)';
      let statusTag = '';

      if (holiday) {
        bgStyle = 'rgba(16, 185, 129, 0.15)';
        borderStyle = '1px solid #10b981';
        statusTag = `<span style="font-size: 0.7rem; color: #10b981; font-weight: 700; display: block; margin-top: 0.25rem;">🎉 ${holiday.title}</span>`;
      } else if (activeLeave) {
        if (activeLeave.status === 'Approved') {
          bgStyle = 'rgba(124, 58, 237, 0.2)';
          borderStyle = '1px solid #7c3aed';
          statusTag = `<span style="font-size: 0.7rem; color: #c084fc; font-weight: 700; display: block; margin-top: 0.25rem;">🟪 Validated</span>`;
        } else if (activeLeave.status === 'Pending') {
          bgStyle = 'rgba(245, 158, 11, 0.2)';
          borderStyle = '1px dashed #f59e0b';
          statusTag = `<span style="font-size: 0.7rem; color: #f59e0b; font-weight: 700; display: block; margin-top: 0.25rem;">⏳ To Approve</span>`;
        } else if (activeLeave.status === 'Rejected') {
          bgStyle = 'rgba(239, 68, 68, 0.2)';
          borderStyle = '1px solid #ef4444';
          statusTag = `<span style="font-size: 0.7rem; color: #ef4444; font-weight: 700; display: block; margin-top: 0.25rem;">🔴 Refused</span>`;
        }
      }

      gridHTML += `
        <div style="background: ${bgStyle}; border: ${borderStyle}; border-radius: var(--radius-md); padding: 0.5rem; min-height: 80px; display: flex; flex-direction: column; justify-content: space-between;">
          <strong style="font-size: 1rem; color: var(--text-main); font-family: monospace;">${d}</strong>
          ${statusTag}
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center; font-weight: 700; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.5rem;">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem;">
        ${gridHTML}
      </div>
    `;
  }
}
