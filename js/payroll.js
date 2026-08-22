/* Dayflow HRMS - Payroll Module (Pro-Rated Absence Deduction Formula) */
import { db, calculateProRatedSalary } from './db.js';
import { Auth } from './auth.js';

export class Payroll {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();
    const allUsers = db.getUsers();

    // Calculate current user's pro-rated salary based on attendance formula
    const userCalc = calculateProRatedSalary(user);

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">Payroll & Salary Management</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">
            Automated attendance-based salary adjustments: <code style="color: var(--primary-accent); font-weight: 700;">Salary × (Days Present / Total Days in Month)</code>
          </p>
        </div>
        <button class="btn btn-accent" id="btn-generate-payslip">
          📄 Generate Pay Slip (PDF Print)
        </button>
      </div>

      <!-- Overview Cards for Logged-In User -->
      <div class="grid-stats" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div class="stat-details">
            <p>Monthly Base Wage</p>
            <h3>₹ ${userCalc.baseMonthlyWage.toLocaleString()}</h3>
            <p style="color: var(--accent); margin-top: 0.25rem;">Full month standard wage</p>
          </div>
          <div class="stat-icon primary">💵</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Absence Salary Deduction</p>
            <h3 style="color: var(--status-absent);">- ₹ ${Math.round(userCalc.absenceDeduction).toLocaleString()}</h3>
            <p style="color: var(--status-absent); margin-top: 0.25rem;">${userCalc.absentDays} Days Absent (${userCalc.effectivePresentDays}/${userCalc.totalDaysInMonth} Days Present)</p>
          </div>
          <div class="stat-icon danger">📉</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Net Payable Take-Home</p>
            <h3 style="color: var(--status-present);">₹ ${Math.round(userCalc.finalNetSalary).toLocaleString()}</h3>
            <p style="color: var(--status-present); margin-top: 0.25rem;">Pro-rated Credited Net Pay</p>
          </div>
          <div class="stat-icon success">💰</div>
        </div>
      </div>

      ${isAdmin ? `
        <!-- Admin Master Payroll Table (Pro-Rated Calculations for All Staff) -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 class="card-title">Organization Master Payroll (Attendance-Adjusted)</h3>
              <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.2rem;">
                Employee salaries are automatically adjusted based on days present vs absent.
              </p>
            </div>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Base Monthly Wage</th>
                  <th>Attendance Ratio</th>
                  <th>Absence Deduction</th>
                  <th>Pro-Rated Gross</th>
                  <th>Final Net Payable</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${allUsers.map(emp => {
                  const calc = calculateProRatedSalary(emp);
                  return `
                    <tr>
                      <td>
                        <strong>${emp.name}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${emp.id} • ${emp.department}</div>
                      </td>
                      <td>₹ ${calc.baseMonthlyWage.toLocaleString()}</td>
                      <td>
                        <span class="badge ${calc.absentDays > 0 ? 'badge-warning' : 'badge-success'}" style="font-family: monospace;">
                          ${calc.effectivePresentDays} / ${calc.totalDaysInMonth} Days
                        </span>
                      </td>
                      <td>
                        <span style="color: ${calc.absentDays > 0 ? 'var(--status-absent)' : 'var(--text-muted)'}; font-weight: 600;">
                          ${calc.absentDays > 0 ? `- ₹ ${Math.round(calc.absenceDeduction).toLocaleString()}` : '₹ 0 (Full Present)'}
                        </span>
                      </td>
                      <td>₹ ${Math.round(calc.proRatedGross).toLocaleString()}</td>
                      <td><strong style="color: var(--status-present); font-size: 0.95rem;">₹ ${Math.round(calc.finalNetSalary).toLocaleString()}</strong></td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-print-emp-slip" data-id="${emp.id}">
                          View Pay Slip
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Personal Salary & Absence Deduction Formula Breakdown Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Attendance-Adjusted Salary Calculation Breakdown</h3>
          <span class="role-badge employee">Pro-Rated Formula Active</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-muted); font-weight: 700;">PRO-RATED SALARY FORMULA</h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              <div style="padding: 0.85rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Standard Base Wage</div>
                <strong style="font-size: 1.05rem;">₹ ${userCalc.baseMonthlyWage.toLocaleString()} / Month</strong>
              </div>
              <div style="padding: 0.85rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Attendance Ratio (Days Present / Total Days)</div>
                <strong style="font-size: 1.05rem; color: var(--primary-accent);">${userCalc.effectivePresentDays} Days Present ÷ ${userCalc.totalDaysInMonth} Days = ${(userCalc.attendanceRatio * 100).toFixed(1)}%</strong>
              </div>
              <div style="padding: 0.85rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">Formula: Salary × (Days Present / Total Days)</div>
                <strong style="font-size: 1.05rem; color: var(--status-present);">₹ ${userCalc.baseMonthlyWage.toLocaleString()} × (${userCalc.effectivePresentDays}/${userCalc.totalDaysInMonth}) = ₹ ${Math.round(userCalc.proRatedGross).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-muted); font-weight: 700;">DEDUCTIONS & FINAL PAYOUT</h4>
            <div style="display: flex; flex-direction: column; gap: 0.65rem;">
              <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Absence Deduction (${userCalc.absentDays} Days Absent)</span>
                <strong style="color: var(--status-absent);">- ₹ ${Math.round(userCalc.absenceDeduction).toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Fixed Deductions (PF / Tax)</span>
                <strong>- ₹ ${userCalc.fixedDeductions.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.85rem; background: var(--bg-surface-secondary); border-radius: var(--radius-md); border: 1px solid var(--primary);">
                <strong style="color: var(--primary);">FINAL NET PAYABLE AMOUNT</strong>
                <strong style="color: var(--primary); font-size: 1.15rem;">₹ ${Math.round(userCalc.finalNetSalary).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payslip Modal -->
      <div class="modal-overlay" id="modal-payslip">
        <div class="modal" style="max-width: 680px;">
          <div class="modal-header">
            <h3 class="modal-title">Official Pay Slip Statement</h3>
            <button class="btn btn-secondary btn-sm" id="btn-close-payslip">✕</button>
          </div>
          <div class="modal-body" id="payslip-print-content" style="background: white; color: #1e293b; padding: 2rem; border-radius: var(--radius-md);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary); padding-bottom: 1rem; margin-bottom: 1.25rem;">
              <div>
                <h2 style="color: var(--primary); font-weight: 800; font-size: 1.5rem; letter-spacing: -0.02em;">DAYFLOW HRMS</h2>
                <p style="font-size: 0.8rem; color: #64748b;">Every workday, perfectly aligned.</p>
              </div>
              <div style="text-align: right;">
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700;">MONTHLY SALARY SLIP</h4>
                <p style="font-size: 0.85rem; color: #64748b;">Pay Period: August 2026</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; font-size: 0.875rem;">
              <div>
                <p><strong>Employee Name:</strong> <span id="ps-emp-name">${user.name}</span></p>
                <p><strong>Employee ID:</strong> <span id="ps-emp-id">${user.id}</span></p>
                <p><strong>Department:</strong> <span id="ps-emp-dept">${user.department}</span></p>
              </div>
              <div>
                <p><strong>Designation:</strong> <span id="ps-emp-pos">${user.position}</span></p>
                <p><strong>Joining Date:</strong> <span id="ps-emp-join">${user.joinDate}</span></p>
                <p><strong>Payment Mode:</strong> Direct Bank Transfer</p>
              </div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.75rem; border-radius: 6px; margin-bottom: 1.25rem; font-size: 0.85rem;">
              <strong style="color: #0f172a;">Attendance Formula Calculation:</strong>
              <div style="color: #475569; margin-top: 0.2rem;">
                <span id="ps-att-summary">${userCalc.effectivePresentDays} / ${userCalc.totalDaysInMonth} Days Present (${userCalc.absentDays} Days Absent)</span>
                <div>Formula: Base Wage <span id="ps-base-wage">₹ ${userCalc.baseMonthlyWage.toLocaleString()}</span> × (<span id="ps-ratio-text">${userCalc.effectivePresentDays}/${userCalc.totalDaysInMonth}</span>) = <strong style="color: #10b981;" id="ps-prorated-gross">₹ ${Math.round(userCalc.proRatedGross).toLocaleString()}</strong></div>
              </div>
            </div>

            <table class="table" style="margin-bottom: 1.25rem; border: 1px solid #e2e8f0; width: 100%;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 0.5rem 0.75rem;">Earnings Item</th>
                  <th style="padding: 0.5rem 0.75rem;">Amount (₹)</th>
                  <th style="padding: 0.5rem 0.75rem;">Deductions Item</th>
                  <th style="padding: 0.5rem 0.75rem;">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 0.5rem 0.75rem;">Base Monthly Wage</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-basic">₹ ${userCalc.baseMonthlyWage.toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">Absence Salary Deduction</td>
                  <td style="padding: 0.5rem 0.75rem; color: #ef4444;"><span id="ps-absent-ded">- ₹ ${Math.round(userCalc.absenceDeduction).toLocaleString()}</span></td>
                </tr>
                <tr>
                  <td style="padding: 0.5rem 0.75rem;">Pro-Rated Gross Earnings</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-gross">₹ ${Math.round(userCalc.proRatedGross).toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">Fixed Withholdings (PF/Tax)</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-fixed-ded">₹ ${userCalc.fixedDeductions.toLocaleString()}</span></td>
                </tr>
              </tbody>
            </table>

            <div style="background: #f3eff2; padding: 1rem; border-radius: 6px; text-align: center;">
              <h3 style="color: var(--primary); margin: 0; font-size: 1.25rem; font-weight: 800;">NET PAYABLE AMOUNT: <span id="ps-net">₹ ${Math.round(userCalc.finalNetSalary).toLocaleString()}</span></h3>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel-payslip">Close</button>
            <button class="btn btn-primary" id="btn-trigger-print">🖨️ Print / Download PDF</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const modal = container.querySelector('#modal-payslip');
    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    container.querySelector('#btn-generate-payslip')?.addEventListener('click', openModal);
    container.querySelector('#btn-close-payslip')?.addEventListener('click', closeModal);
    container.querySelector('#btn-cancel-payslip')?.addEventListener('click', closeModal);

    container.querySelector('#btn-trigger-print')?.addEventListener('click', () => {
      window.print();
    });

    if (isAdmin) {
      container.querySelectorAll('.btn-print-emp-slip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const empId = e.currentTarget.getAttribute('data-id');
          const emp = db.getUserById(empId);
          if (emp) {
            const calc = calculateProRatedSalary(emp);
            
            container.querySelector('#ps-emp-name').innerText = emp.name;
            container.querySelector('#ps-emp-id').innerText = emp.id;
            container.querySelector('#ps-emp-dept').innerText = emp.department;
            container.querySelector('#ps-emp-pos').innerText = emp.position;
            container.querySelector('#ps-emp-join').innerText = emp.joinDate;

            container.querySelector('#ps-att-summary').innerText = `${calc.effectivePresentDays} / ${calc.totalDaysInMonth} Days Present (${calc.absentDays} Days Absent)`;
            container.querySelector('#ps-base-wage').innerText = '₹ ' + calc.baseMonthlyWage.toLocaleString();
            container.querySelector('#ps-ratio-text').innerText = `${calc.effectivePresentDays}/${calc.totalDaysInMonth}`;
            container.querySelector('#ps-prorated-gross').innerText = '₹ ' + Math.round(calc.proRatedGross).toLocaleString();

            container.querySelector('#ps-basic').innerText = '₹ ' + calc.baseMonthlyWage.toLocaleString();
            container.querySelector('#ps-absent-ded').innerText = '- ₹ ' + Math.round(calc.absenceDeduction).toLocaleString();
            container.querySelector('#ps-gross').innerText = '₹ ' + Math.round(calc.proRatedGross).toLocaleString();
            container.querySelector('#ps-fixed-ded').innerText = '₹ ' + calc.fixedDeductions.toLocaleString();
            container.querySelector('#ps-net').innerText = '₹ ' + Math.round(calc.finalNetSalary).toLocaleString();

            openModal();
          }
        });
      });
    }
  }
}
