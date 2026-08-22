/* Dayflow HRMS - Profile Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Profile {
  static render(container, targetEmpId = null, showToast) {
    const currentUser = Auth.getCurrentUser();
    const isSelf = !targetEmpId || targetEmpId.toLowerCase() === currentUser.id.toLowerCase();
    const userToView = isSelf ? currentUser : db.getUserById(targetEmpId) || currentUser;
    const isAdmin = Auth.isAdmin();

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">${isSelf ? 'My Profile' : `Employee Profile - ${userToView.name}`}</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">View personal details, job role, salary structure, and official documents.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${!isSelf && isAdmin && userToView.role !== 'admin' ? `
            <button class="btn btn-danger btn-sm btn-delete-user-profile" data-id="${userToView.id}" data-name="${userToView.name}">
              🗑️ Delete Employee Record
            </button>
          ` : ''}
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem;">
        <!-- Left Sidebar Card -->
        <div class="card" style="text-align: center;">
          <div style="position: relative; display: inline-block; margin: 1rem 0;">
            <img src="${userToView.avatar}" id="profile-avatar-img" style="width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 4px solid var(--primary-light);" />
            <button class="btn btn-sm btn-secondary" id="btn-change-avatar" title="Change Avatar URL" style="position: absolute; bottom: 0; right: -5px; border-radius: 50%; width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">📷</button>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700;">${userToView.name}</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem;">${userToView.position}</p>
          <span class="role-badge ${userToView.role}" style="margin-top: 0.5rem;">${userToView.role.toUpperCase()}</span>

          <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); text-align: left; display: flex; flex-direction: column; gap: 0.85rem;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">AUTOMATED LOGIN ID</span>
              <strong style="font-size: 0.95rem; color: var(--primary-accent); font-family: monospace;">${userToView.id}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">COMPANY NAME</span>
              <strong style="font-size: 0.9rem;">${userToView.companyName || 'Odoo India'}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">DEPARTMENT</span>
              <strong style="font-size: 0.9rem;">${userToView.department}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">JOINING DATE</span>
              <strong style="font-size: 0.9rem;">${userToView.joinDate}</strong>
            </div>
          </div>
        </div>

        <!-- Main Details Tabs -->
        <div>
          <div class="tabs">
            <button class="tab-btn active" data-tab="personal">Personal Details</button>
            <button class="tab-btn" data-tab="job">Job & Role Details</button>
            <button class="tab-btn" data-tab="salary">Salary Info</button>
            <button class="tab-btn" data-tab="documents">Documents</button>
          </div>

          <!-- Personal Tab -->
          <div class="tab-content card" id="tab-personal">
            <form id="form-profile-personal">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" name="name" value="${userToView.name}" ${!isAdmin ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <input type="email" class="form-control" name="email" value="${userToView.email}" ${!isAdmin ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="text" class="form-control" name="phone" value="${userToView.phone || ''}" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Residential Address</label>
                  <input type="text" class="form-control" name="address" value="${userToView.address || ''}" required />
                </div>
              </div>
              <div style="margin-top: 1rem; text-align: right;">
                <button type="submit" class="btn btn-purple">Save Personal Details</button>
              </div>
            </form>

            ${isSelf ? `
              <!-- Change Password Box (As documented in diagram note) -->
              <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary-accent);">Change Password</h4>
                <form id="form-change-password">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div class="form-group">
                      <label class="form-label">Current Password</label>
                      <input type="password" class="form-control" name="currentPassword" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">New Password (Min 6 chars)</label>
                      <input type="password" class="form-control" name="newPassword" required />
                    </div>
                  </div>
                  <div style="text-align: right; margin-top: 0.5rem;">
                    <button type="submit" class="btn btn-secondary">Update Password</button>
                  </div>
                </form>
              </div>
            ` : ''}
          </div>

          <!-- Job Tab -->
          <div class="tab-content card" id="tab-job" style="display: none;">
            <form id="form-profile-job">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label">Department</label>
                  <input type="text" class="form-control" name="department" value="${userToView.department}" ${!isAdmin ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">Designation / Position</label>
                  <input type="text" class="form-control" name="position" value="${userToView.position}" ${!isAdmin ? 'disabled' : ''} />
                </div>
                <div class="form-group">
                  <label class="form-label">System Role</label>
                  <select class="form-control" name="role" ${!isAdmin ? 'disabled' : ''}>
                    <option value="employee" ${userToView.role === 'employee' ? 'selected' : ''}>Employee</option>
                    <option value="admin" ${userToView.role === 'admin' ? 'selected' : ''}>Admin / HR Officer</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Date of Joining</label>
                  <input type="date" class="form-control" name="joinDate" value="${userToView.joinDate}" ${!isAdmin ? 'disabled' : ''} />
                </div>
              </div>
              ${isAdmin ? `
                <div style="margin-top: 1.25rem; text-align: right;">
                  <button type="submit" class="btn btn-purple">Update Job Info (HR Admin Only)</button>
                </div>
              ` : '<p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem;">Job and Role details can only be edited by HR Administrators.</p>'}
            </form>
          </div>

          <!-- Salary Info Tab -->
          <div class="tab-content card" id="tab-salary" style="display: none;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <div style="background: var(--bg-surface-secondary); padding: 1rem; border-radius: var(--radius-md);">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">BASIC PAY</span>
                <h4 style="font-size: 1.25rem;">$${userToView.salary.basic.toLocaleString()} / mo</h4>
              </div>
              <div style="background: var(--bg-surface-secondary); padding: 1rem; border-radius: var(--radius-md);">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">HRA & ALLOWANCES</span>
                <h4 style="font-size: 1.25rem;">$${(userToView.salary.hra + userToView.salary.allowances).toLocaleString()} / mo</h4>
              </div>
              <div style="background: var(--bg-surface-secondary); padding: 1rem; border-radius: var(--radius-md);">
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">NET MONTHLY PAY</span>
                <h4 style="font-size: 1.25rem; color: var(--status-present);">$${(userToView.salary.basic + userToView.salary.hra + userToView.salary.allowances - userToView.salary.deductions).toLocaleString()} / mo</h4>
              </div>
            </div>
            ${isAdmin ? `
              <form id="form-profile-salary">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label">Basic Salary ($)</label>
                    <input type="number" class="form-control" name="basic" value="${userToView.salary.basic}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">HRA ($)</label>
                    <input type="number" class="form-control" name="hra" value="${userToView.salary.hra}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Special Allowances ($)</label>
                    <input type="number" class="form-control" name="allowances" value="${userToView.salary.allowances}" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Deductions / PF ($)</label>
                    <input type="number" class="form-control" name="deductions" value="${userToView.salary.deductions}" />
                  </div>
                </div>
                <div style="margin-top: 1.25rem; text-align: right;">
                  <button type="submit" class="btn btn-purple">Update Salary Structure (HR Admin Only)</button>
                </div>
              </form>
            ` : '<p style="font-size: 0.85rem; color: var(--text-muted);">Salary structure details are read-only for employees.</p>'}
          </div>

          <!-- Documents Tab -->
          <div class="tab-content card" id="tab-documents" style="display: none;">
            <h4 style="font-size: 1rem; margin-bottom: 1rem;">Employee Documents Repository</h4>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div>
                  <strong>Employment Contract Agreement.pdf</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Signed & Verified on ${userToView.joinDate}</div>
                </div>
                <button class="btn btn-secondary btn-sm btn-preview-doc" data-doc="Employment Contract">Preview Document</button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div>
                  <strong>Government ID & Passport.pdf</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Verified Identity Document</div>
                </div>
                <button class="btn btn-secondary btn-sm btn-preview-doc" data-doc="Government ID">Preview Document</button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <div>
                  <strong>Tax W-4 Form & Declaration.pdf</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Annual Tax Compliance</div>
                </div>
                <button class="btn btn-secondary btn-sm btn-preview-doc" data-doc="Tax Form">Preview Document</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach Back button
    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      document.querySelector('[data-view="dashboard"]')?.click();
    });

    // Tab switching logic
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        
        e.currentTarget.classList.add('active');
        const tabName = e.currentTarget.getAttribute('data-tab');
        const content = container.querySelector(`#tab-${tabName}`);
        if (content) content.style.display = 'block';
      });
    });

    // Handle Personal Info Update
    const personalForm = container.querySelector('#form-profile-personal');
    if (personalForm) {
      personalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(personalForm);
        userToView.phone = formData.get('phone');
        userToView.address = formData.get('address');
        if (isAdmin) {
          userToView.name = formData.get('name');
          userToView.email = formData.get('email');
        }
        db.saveUser(userToView);
        showToast('Profile details updated successfully!', 'success');
      });
    }

    // Handle Password Change Form
    const pwForm = container.querySelector('#form-change-password');
    if (pwForm) {
      pwForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(pwForm);
        try {
          Auth.changePassword(userToView.id, formData.get('currentPassword'), formData.get('newPassword'));
          showToast('Password updated successfully!', 'success');
          pwForm.reset();
        } catch (err) {
          showToast(err.message, 'danger');
        }
      });
    }

    // Handle Job Info Update (Admin)
    const jobForm = container.querySelector('#form-profile-job');
    if (jobForm) {
      jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(jobForm);
        userToView.department = formData.get('department');
        userToView.position = formData.get('position');
        userToView.role = formData.get('role');
        userToView.joinDate = formData.get('joinDate');
        db.saveUser(userToView);
        showToast('Job & Role details updated!', 'success');
      });
    }

    // Handle Salary Update (Admin)
    const salaryForm = container.querySelector('#form-profile-salary');
    if (salaryForm) {
      salaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(salaryForm);
        userToView.salary = {
          basic: parseFloat(formData.get('basic')) || 0,
          hra: parseFloat(formData.get('hra')) || 0,
          allowances: parseFloat(formData.get('allowances')) || 0,
          deductions: parseFloat(formData.get('deductions')) || 0
        };
        db.saveUser(userToView);
        showToast('Salary structure updated!', 'success');
      });
    }

    // Avatar update button handler
    container.querySelector('#btn-change-avatar')?.addEventListener('click', () => {
      const newAvatar = prompt('Enter image URL for employee avatar:', userToView.avatar);
      if (newAvatar && newAvatar.trim()) {
        userToView.avatar = newAvatar.trim();
        db.saveUser(userToView);
        container.querySelector('#profile-avatar-img').src = userToView.avatar;
        showToast('Avatar updated!', 'success');
      }
    });

    // Delete Employee handler from profile
    container.querySelector('.btn-delete-user-profile')?.addEventListener('click', (e) => {
      const empId = e.currentTarget.getAttribute('data-id');
      const empName = e.currentTarget.getAttribute('data-name');
      if (confirm(`Are you sure you want to permanently delete employee '${empName}' (${empId}) from the database?`)) {
        db.deleteUser(empId);
        if (showToast) showToast(`Employee '${empName}' (${empId}) deleted successfully from database.`, 'warning');
        const backBtn = container.querySelector('#btn-back-dashboard') || document.getElementById('btn-global-back');
        if (backBtn) backBtn.click();
      }
    });

    // Preview Doc handlers
    container.querySelectorAll('.btn-preview-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const docTitle = e.currentTarget.getAttribute('data-doc');
        const modal = document.getElementById('modal-doc-preview');
        if (modal) {
          document.getElementById('doc-modal-title').innerText = `${docTitle} - ${userToView.name}`;
          document.getElementById('doc-modal-content').innerHTML = `
            <div style="border: 2px dashed var(--border-color); padding: 2.5rem; text-align: center; border-radius: var(--radius-md); background: var(--bg-surface-secondary);">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📄</div>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.25rem;">${docTitle}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Verified digital document archived on Dayflow HRMS storage.</p>
              <div style="margin-top: 1.25rem; font-size: 0.8rem; color: var(--primary-accent); font-weight: 600;">
                Document Hash: SHA256-DF-${userToView.id}-${Date.now()}
              </div>
            </div>
          `;
          modal.classList.add('active');
        }
      });
    });
  }
}
