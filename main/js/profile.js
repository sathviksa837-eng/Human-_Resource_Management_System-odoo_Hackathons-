/* Dayflow HRMS - Profile Module (Admin Wireframe Spec & Salary Info) */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Profile {
  static render(container, targetEmpId = null, showToast) {
    const currentUser = Auth.getCurrentUser();
    const isSelf = !targetEmpId || targetEmpId.toLowerCase() === currentUser.id.toLowerCase();
    const userToView = isSelf ? currentUser : db.getUserById(targetEmpId) || currentUser;
    const isAdmin = Auth.isAdmin();

    // Default Resume Data if not set
    if (!userToView.about) {
      userToView.about = "Dedicated professional with extensive experience in driving team productivity, delivering high-impact projects, and maintaining operational excellence.";
    }
    if (!userToView.loveJob) {
      userToView.loveJob = "I love solving complex workflow challenges, collaborating across cross-functional teams, and building scalable solutions that create real business value.";
    }
    if (!userToView.interests) {
      userToView.interests = "Tech blogging, open-source contributing, UI design, chess, and marathon running.";
    }
    if (!userToView.skills) {
      userToView.skills = ["JavaScript (ES6+)", "UI/UX Design", "Project Management", "Agile Workflow", "System Architecture"];
    }
    if (!userToView.certifications) {
      userToView.certifications = ["Certified Scrum Master (CSM)", "AWS Certified Cloud Practitioner", "Odoo HR Professional Certification"];
    }

    // Salary Structure Defaults (Matching Wireframe Spec: Month Wage 50,000)
    const monthWage = userToView.salary ? (userToView.salary.monthWage || userToView.salary.basic * 2 || 50000) : 50000;
    const workingDays = userToView.salary ? (userToView.salary.workingDays || 5) : 5;
    const breakHours = userToView.salary ? (userToView.salary.breakHours || 1) : 1;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">${isSelf ? 'My Profile' : `Employee Profile - ${userToView.name}`}</h2>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Manage personal details, skills, certifications, and HR salary structures.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${!isSelf && isAdmin && userToView.role !== 'admin' ? `
            <button class="btn btn-danger btn-sm btn-delete-user-profile" data-id="${userToView.id}" data-name="${userToView.name}">
              🗑️ Delete Employee Record
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Top Profile Card Header (Matching Left Wireframe Diagram) -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.75rem; border: 1px solid var(--border-color);">
        <div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">
          <!-- Circle Avatar with Pencil Edit Icon -->
          <div style="position: relative;">
            <img src="${userToView.avatar}" id="profile-avatar-img" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--primary-light); box-shadow: var(--shadow-md);" />
            <button class="btn btn-sm btn-purple" id="btn-change-avatar" title="Edit Profile Picture" style="position: absolute; bottom: 4px; right: 4px; border-radius: 50%; width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">✏️</button>
          </div>

          <!-- User Header Details Grid -->
          <div style="flex: 1; min-width: 280px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin: 0;">${userToView.name}</h2>
              <span class="role-badge ${userToView.role}">${userToView.role.toUpperCase()}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.85rem 1.75rem; font-size: 0.9rem;">
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Login ID</span>
                <code style="font-size: 0.9rem; font-weight: 700; color: var(--primary-accent);">${userToView.id}</code>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Company</span>
                <strong>${userToView.companyName || 'Odoo India'}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Email</span>
                <strong>${userToView.email}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Department</span>
                <strong>${userToView.department}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Mobile</span>
                <strong>${userToView.phone || '+1 (555) 000-0000'}</strong>
              </div>
              <div>
                <span style="color: var(--text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; display: block;">Location</span>
                <strong>${userToView.address || 'Springfield, OR'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs (Salary Info ONLY Visible to Admin!) -->
      <div class="tabs" style="margin-bottom: 1.25rem;">
        <button class="tab-btn active" data-tab="resume">Resume</button>
        <button class="tab-btn" data-tab="private-info">Private Info</button>
        ${isAdmin ? `<button class="tab-btn" data-tab="salary-info">Salary Info</button>` : ''}
      </div>

      <!-- TAB 1: RESUME (Matching Left Wireframe Layout) -->
      <div class="tab-content card" id="tab-resume">
        <div style="display: grid; grid-template-columns: 2fr 1.2fr; gap: 1.5rem;">
          <!-- Left Column: About, Love About Job, Interests -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- About Box -->
            <div style="background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">About</h4>
              <textarea class="form-control" id="input-profile-about" rows="3" style="width: 100%; font-size: 0.88rem; background: var(--bg-surface); line-height: 1.5;">${userToView.about}</textarea>
            </div>

            <!-- What I love about my job Box -->
            <div style="background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">What I love about my job</h4>
              <textarea class="form-control" id="input-profile-lovejob" rows="3" style="width: 100%; font-size: 0.88rem; background: var(--bg-surface); line-height: 1.5;">${userToView.loveJob}</textarea>
            </div>

            <!-- My interests and hobbies Box -->
            <div style="background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">My interests and hobbies</h4>
              <textarea class="form-control" id="input-profile-interests" rows="3" style="width: 100%; font-size: 0.88rem; background: var(--bg-surface); line-height: 1.5;">${userToView.interests}</textarea>
            </div>

            <div style="text-align: right;">
              <button class="btn btn-purple btn-sm" id="btn-save-resume">Save Resume Details</button>
            </div>
          </div>

          <!-- Right Column: Skills & Certification -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Skills Box -->
            <div style="background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; min-height: 180px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main);">Skills</h4>
                <button class="btn btn-secondary btn-sm" id="btn-add-skill" style="padding: 0.25rem 0.5rem; font-size: 0.78rem;">+ Add Skills</button>
              </div>
              <div id="skills-list-container" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${userToView.skills.map((skill, idx) => `
                  <span class="badge" style="background: rgba(124, 58, 237, 0.15); color: var(--primary-accent); border: 1px solid var(--primary-accent); padding: 0.35rem 0.65rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                    ${skill}
                    <span style="cursor: pointer; opacity: 0.7;" class="btn-remove-skill" data-idx="${idx}">✕</span>
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Certification Box -->
            <div style="background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; min-height: 180px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main);">Certification</h4>
                <button class="btn btn-secondary btn-sm" id="btn-add-cert" style="padding: 0.25rem 0.5rem; font-size: 0.78rem;">+ Add Certification</button>
              </div>
              <div id="cert-list-container" style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${userToView.certifications.map((cert, idx) => `
                  <div style="padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <span>🎓 ${cert}</span>
                    <span style="cursor: pointer; color: var(--status-absent);" class="btn-remove-cert" data-idx="${idx}">✕</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: PRIVATE INFO -->
      <div class="tab-content card" id="tab-private-info" style="display: none;">
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
            <button type="submit" class="btn btn-purple">Save Private Info</button>
          </div>
        </form>

        ${isSelf ? `
          <!-- Change Password Box -->
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

      <!-- TAB 3: SALARY INFO (ADMIN ONLY - MATCHING RIGHT WIREFRAME DIAGRAM EXACTLY!) -->
      ${isAdmin ? `
        <div class="tab-content card" id="tab-salary-info" style="display: none; padding: 1.75rem;">
          <!-- Top Header Title -->
          <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">Salary Info</h3>
            <span class="role-badge admin">🔒 Admin / HR Exclusive Access</span>
          </div>

          <!-- Top Summary Metrics Grid (Month Wage, Yearly Wage, Working Days, Break Time) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; background: var(--bg-surface-secondary); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); margin-bottom: 1.75rem;">
            <div>
              <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">Month Wage</label>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="number" id="sal-input-month-wage" class="form-control" value="${monthWage}" style="font-size: 1.1rem; font-weight: 700; width: 140px; padding: 0.35rem 0.65rem;" />
                <span style="font-weight: 600; color: var(--text-muted);">₹ / Month</span>
              </div>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">Yearly Wage</label>
              <div style="font-size: 1.1rem; font-weight: 800; color: var(--status-present); padding-top: 0.35rem;">
                <span id="sal-val-yearly-wage">₹ ${(monthWage * 12).toLocaleString()}</span> <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ Yearly</span>
              </div>
            </div>

            <div>
              <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">No of working days in a week:</label>
              <input type="number" id="sal-input-working-days" class="form-control" value="${workingDays}" style="font-size: 0.95rem; font-weight: 700; width: 80px; padding: 0.35rem 0.65rem;" />
            </div>

            <div>
              <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">Break Time:</label>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <input type="number" id="sal-input-break-time" class="form-control" value="${breakHours}" style="font-size: 0.95rem; font-weight: 700; width: 70px; padding: 0.35rem 0.65rem;" />
                <span style="font-weight: 600; color: var(--text-muted);">/ hrs</span>
              </div>
            </div>
          </div>

          <!-- Two Column Salary Components & Deductions Table (Right Wireframe Spec) -->
          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem;">
            <!-- Left Column: Salary Components -->
            <div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                Salary Components
              </h4>

              <div style="display: flex; flex-direction: column; gap: 1.15rem;" id="salary-components-container">
                <!-- Calculated live in script below -->
              </div>
            </div>

            <!-- Right Column: Provident Fund (PF) Contribution & Tax Deductions -->
            <div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                Provident Fund (PF) Contribution
              </h4>

              <div style="display: flex; flex-direction: column; gap: 1.15rem; margin-bottom: 1.75rem;" id="pf-contributions-container">
                <!-- Calculated live in script below -->
              </div>

              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem;">
                Tax Deductions
              </h4>

              <div style="display: flex; flex-direction: column; gap: 1.15rem;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 0.9rem;">Professional Tax</strong>
                    <span style="font-size: 0.95rem; font-weight: 700; color: var(--status-absent);">200.00 ₹ / month</span>
                  </div>
                  <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                    Professional Tax deducted from the Gross salary
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-top: 2rem; text-align: right; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <button class="btn btn-purple" id="btn-save-salary-structure">Save Salary Info (HR Admin Only)</button>
          </div>
        </div>
      ` : ''}
    `;

    container.innerHTML = html;

    // Live Calculation Engine for Salary Info Tab (Matching Right Wireframe Percentages!)
    const renderSalaryComponents = () => {
      const wageInput = container.querySelector('#sal-input-month-wage');
      const yearlyVal = container.querySelector('#sal-val-yearly-wage');
      const compContainer = container.querySelector('#salary-components-container');
      const pfContainer = container.querySelector('#pf-contributions-container');

      if (!wageInput || !compContainer) return;

      const wage = parseFloat(wageInput.value) || 0;
      if (yearlyVal) yearlyVal.innerText = `₹ ${(wage * 12).toLocaleString()}`;

      // Salary Component Calculations (Matching Right Wireframe Specs)
      const basic = wage * 0.50; // 50.00%
      const hra = basic * 0.50; // 50.00% of Basic
      const stdAllowance = basic * 0.1667; // 16.67% of Basic
      const perfBonus = basic * 0.0833; // 8.33% of Basic
      const lta = basic * 0.0833; // 8.33% of Basic
      const fixedAllowance = basic * 0.1167; // 11.67% of Basic

      // PF Calculations
      const empPF = basic * 0.12; // 12.00% of Basic
      const employerPF = basic * 0.12; // 12.00% of Basic

      compContainer.innerHTML = `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">Basic Salary</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${basic.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">50.00 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            Define Basic salary from company cost compute it based on monthly Wages
          </p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">House Rent Allowance</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${hra.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">50.00 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            HRA provided to employees 50% of the basic salary
          </p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">Standard Allowance</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${stdAllowance.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">16.67 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            A standard allowance is a predetermined, fixed amount provided to employee as part of their salary
          </p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">Performance Bonus</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${perfBonus.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">8.33 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            Variable amount paid during payroll. The value defined by the company and calculated as a % of the basic salary
          </p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">Leave Travel Allowance</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${lta.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">8.33 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary
          </p>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.9rem;">Fixed Allowance</strong>
            <div>
              <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${fixedAllowance.toFixed(2)} ₹ / month</span>
              <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">11.67 %</span>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
            Fixed allowance portion of wages is determined after calculating all salary components
          </p>
        </div>
      `;

      if (pfContainer) {
        pfContainer.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 0.9rem;">Employee PF</strong>
              <div>
                <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${empPF.toFixed(2)} ₹ / month</span>
                <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">12.00 %</span>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
              PF is calculated based on the basic salary
            </p>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 0.9rem;">Employer PF</strong>
              <div>
                <span style="font-size: 0.95rem; font-weight: 700; font-family: monospace;">${employerPF.toFixed(2)} ₹ / month</span>
                <span style="font-size: 0.78rem; font-weight: 600; color: var(--primary-accent); margin-left: 0.5rem; background: var(--bg-surface-secondary); padding: 0.1rem 0.4rem; border-radius: var(--radius-sm);">12.00 %</span>
              </div>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">
              PF is calculated based on the basic salary
            </p>
          </div>
        `;
      }
    };

    if (isAdmin) {
      renderSalaryComponents();
      container.querySelector('#sal-input-month-wage')?.addEventListener('input', renderSalaryComponents);
    }

    // Tab Switching Logic
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        
        e.currentTarget.classList.add('active');
        const tabName = e.currentTarget.getAttribute('data-tab');
        const content = container.querySelector(`#tab-${tabName}`);
        if (content) {
          content.style.display = 'block';
          if (tabName === 'salary-info') renderSalaryComponents();
        }
      });
    });

    // Save Resume Details Handler
    container.querySelector('#btn-save-resume')?.addEventListener('click', () => {
      userToView.about = container.querySelector('#input-profile-about').value;
      userToView.loveJob = container.querySelector('#input-profile-lovejob').value;
      userToView.interests = container.querySelector('#input-profile-interests').value;
      db.saveUser(userToView);
      if (showToast) showToast('Resume details updated successfully!', 'success');
    });

    // Skills Add & Remove Handlers
    container.querySelector('#btn-add-skill')?.addEventListener('click', () => {
      const newSkill = prompt('Enter new skill name:');
      if (newSkill && newSkill.trim()) {
        userToView.skills.push(newSkill.trim());
        db.saveUser(userToView);
        Profile.render(container, userToView.id, showToast);
        if (showToast) showToast('Skill added!', 'success');
      }
    });

    container.querySelectorAll('.btn-remove-skill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-idx'));
        userToView.skills.splice(idx, 1);
        db.saveUser(userToView);
        Profile.render(container, userToView.id, showToast);
      });
    });

    // Certification Add & Remove Handlers
    container.querySelector('#btn-add-cert')?.addEventListener('click', () => {
      const newCert = prompt('Enter new certification title:');
      if (newCert && newCert.trim()) {
        userToView.certifications.push(newCert.trim());
        db.saveUser(userToView);
        Profile.render(container, userToView.id, showToast);
        if (showToast) showToast('Certification added!', 'success');
      }
    });

    container.querySelectorAll('.btn-remove-cert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-idx'));
        userToView.certifications.splice(idx, 1);
        db.saveUser(userToView);
        Profile.render(container, userToView.id, showToast);
      });
    });

    // Save Salary Info Handler (Admin Only)
    container.querySelector('#btn-save-salary-structure')?.addEventListener('click', () => {
      const wageInput = container.querySelector('#sal-input-month-wage');
      const workDaysInput = container.querySelector('#sal-input-working-days');
      const breakInput = container.querySelector('#sal-input-break-time');

      const wage = parseFloat(wageInput.value) || 50000;
      const basic = wage * 0.50;
      const hra = basic * 0.50;
      const allowances = basic * 0.1667 + basic * 0.0833 + basic * 0.0833 + basic * 0.1167;
      const deductions = basic * 0.12 + 200;

      userToView.salary = {
        monthWage: wage,
        workingDays: parseInt(workDaysInput.value) || 5,
        breakHours: parseFloat(breakInput.value) || 1,
        basic: basic,
        hra: hra,
        allowances: allowances,
        deductions: deductions
      };

      db.saveUser(userToView);
      if (showToast) showToast(`Salary structure saved for ${userToView.name}!`, 'success');
    });

    // Avatar Change Handler
    container.querySelector('#btn-change-avatar')?.addEventListener('click', () => {
      const newAvatar = prompt('Enter image URL for profile avatar:', userToView.avatar);
      if (newAvatar && newAvatar.trim()) {
        userToView.avatar = newAvatar.trim();
        db.saveUser(userToView);
        container.querySelector('#profile-avatar-img').src = userToView.avatar;
        if (showToast) showToast('Avatar updated!', 'success');
      }
    });

    // Delete Employee Handler
    container.querySelector('.btn-delete-user-profile')?.addEventListener('click', (e) => {
      const empId = e.currentTarget.getAttribute('data-id');
      const empName = e.currentTarget.getAttribute('data-name');
      if (confirm(`Are you sure you want to delete employee record for '${empName}' (${empId})?`)) {
        db.deleteUser(empId);
        if (showToast) showToast(`Employee '${empName}' (${empId}) deleted from database.`, 'warning');
        document.querySelector('[data-view="dashboard"]')?.click();
      }
    });
  }
}
