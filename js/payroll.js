/* Dayflow HRMS - Payroll Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Payroll {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();
    const allUsers = db.getUsers();

    const currentSalary = user.salary || { basic: 5000, hra: 1500, allowances: 1000, deductions: 500 };
    const netSalary = currentSalary.basic + currentSalary.hra + currentSalary.allowances - currentSalary.deductions;

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">Payroll & Salary Management</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">View salary structures, generate monthly payslips, and manage compensation.</p>
        </div>
        <button class="btn btn-accent" id="btn-generate-payslip">
          📄 Generate Pay Slip (PDF Print)
        </button>
      </div>

      <!-- Overview Cards -->
      <div class="grid-stats" style="margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div class="stat-details">
            <p>Monthly Gross Salary</p>
            <h3>$${(currentSalary.basic + currentSalary.hra + currentSalary.allowances).toLocaleString()}</h3>
            <p style="color: var(--accent); margin-top: 0.25rem;">Before deductions</p>
          </div>
          <div class="stat-icon primary">💵</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Total Deductions (PF/Tax)</p>
            <h3>$${currentSalary.deductions.toLocaleString()}</h3>
            <p style="color: var(--status-absent); margin-top: 0.25rem;">Monthly withholdings</p>
          </div>
          <div class="stat-icon danger">📉</div>
        </div>

        <div class="stat-card">
          <div class="stat-details">
            <p>Net Take-Home Pay</p>
            <h3>$${netSalary.toLocaleString()}</h3>
            <p style="color: var(--status-present); margin-top: 0.25rem;">Credited to account</p>
          </div>
          <div class="stat-icon success">💰</div>
        </div>
      </div>

      ${isAdmin ? `
        <!-- Admin Master Payroll Table -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <div class="card-header">
            <h3 class="card-title">Organization Master Payroll (Admin Control)</h3>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Basic Pay</th>
                  <th>HRA</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Monthly Salary</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${allUsers.map(emp => {
                  const sal = emp.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
                  const net = sal.basic + sal.hra + sal.allowances - sal.deductions;
                  return `
                    <tr>
                      <td>
                        <strong>${emp.name}</strong>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${emp.id} • ${emp.department}</div>
                      </td>
                      <td>$${sal.basic.toLocaleString()}</td>
                      <td>$${sal.hra.toLocaleString()}</td>
                      <td>$${sal.allowances.toLocaleString()}</td>
                      <td>$${sal.deductions.toLocaleString()}</td>
                      <td><strong style="color: var(--status-present);">$${net.toLocaleString()}</strong></td>
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

      <!-- Personal Salary Breakdown Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">My Compensation Breakdown (Read-Only)</h3>
          <span class="role-badge employee">Active Salary Structure</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-muted); font-weight: 700;">EARNINGS BREAKDOWN</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Basic Salary</span>
                <strong>$${currentSalary.basic.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>House Rent Allowance (HRA)</span>
                <strong>$${currentSalary.hra.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Special & Performance Allowance</span>
                <strong>$${currentSalary.allowances.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-muted); font-weight: 700;">DEDUCTIONS & TAXES</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Provident Fund (PF 60%)</span>
                <strong>$${Math.round(currentSalary.deductions * 0.6).toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm);">
                <span>Income Tax Withholding (40%)</span>
                <strong>$${Math.round(currentSalary.deductions * 0.4).toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 0.65rem; background: var(--bg-surface-secondary); border-radius: var(--radius-sm); border: 1px solid var(--primary);">
                <strong style="color: var(--primary);">NET MONTHLY PAYOUT</strong>
                <strong style="color: var(--primary); font-size: 1.1rem;">$${netSalary.toLocaleString()}</strong>
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
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary); padding-bottom: 1rem; margin-bottom: 1.5rem;">
              <div>
                <h2 style="color: var(--primary); font-weight: 800; font-size: 1.5rem; letter-spacing: -0.02em;">DAYFLOW HRMS</h2>
                <p style="font-size: 0.8rem; color: #64748b;">Every workday, perfectly aligned.</p>
              </div>
              <div style="text-align: right;">
                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 700;">MONTHLY SALARY SLIP</h4>
                <p style="font-size: 0.85rem; color: #64748b;">Pay Period: August 2026</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem;">
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

            <table class="table" style="margin-bottom: 1.5rem; border: 1px solid #e2e8f0; width: 100%;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 0.5rem 0.75rem;">Earnings</th>
                  <th style="padding: 0.5rem 0.75rem;">Amount ($)</th>
                  <th style="padding: 0.5rem 0.75rem;">Deductions</th>
                  <th style="padding: 0.5rem 0.75rem;">Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 0.5rem 0.75rem;">Basic Salary</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-basic">$${currentSalary.basic.toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">Provident Fund</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-pf">$${Math.round(currentSalary.deductions * 0.6).toLocaleString()}</span></td>
                </tr>
                <tr>
                  <td style="padding: 0.5rem 0.75rem;">HRA</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-hra">$${currentSalary.hra.toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">Tax Withholding</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-tax">$${Math.round(currentSalary.deductions * 0.4).toLocaleString()}</span></td>
                </tr>
                <tr>
                  <td style="padding: 0.5rem 0.75rem;">Allowances</td>
                  <td style="padding: 0.5rem 0.75rem;"><span id="ps-allowances">$${currentSalary.allowances.toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">-</td>
                  <td style="padding: 0.5rem 0.75rem;">-</td>
                </tr>
                <tr style="font-weight: bold; background: #f1f5f9;">
                  <td style="padding: 0.5rem 0.75rem;">Gross Earnings</td>
                  <td style="padding: 0.5rem 0.75rem;">$<span id="ps-gross">${(currentSalary.basic + currentSalary.hra + currentSalary.allowances).toLocaleString()}</span></td>
                  <td style="padding: 0.5rem 0.75rem;">Total Deductions</td>
                  <td style="padding: 0.5rem 0.75rem;">$<span id="ps-deductions">${currentSalary.deductions.toLocaleString()}</span></td>
                </tr>
              </tbody>
            </table>

            <div style="background: #f3eff2; padding: 1rem; border-radius: 6px; text-align: center;">
              <h3 style="color: var(--primary); margin: 0; font-size: 1.25rem; font-weight: 800;">NET PAYABLE AMOUNT: $<span id="ps-net">${netSalary.toLocaleString()}</span></h3>
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
            const sal = emp.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
            const net = sal.basic + sal.hra + sal.allowances - sal.deductions;
            
            container.querySelector('#ps-emp-name').innerText = emp.name;
            container.querySelector('#ps-emp-id').innerText = emp.id;
            container.querySelector('#ps-emp-dept').innerText = emp.department;
            container.querySelector('#ps-emp-pos').innerText = emp.position;
            container.querySelector('#ps-emp-join').innerText = emp.joinDate;

            container.querySelector('#ps-basic').innerText = '$' + sal.basic.toLocaleString();
            container.querySelector('#ps-hra').innerText = '$' + sal.hra.toLocaleString();
            container.querySelector('#ps-allowances').innerText = '$' + sal.allowances.toLocaleString();
            container.querySelector('#ps-pf').innerText = '$' + Math.round(sal.deductions * 0.6).toLocaleString();
            container.querySelector('#ps-tax').innerText = '$' + Math.round(sal.deductions * 0.4).toLocaleString();
            container.querySelector('#ps-gross').innerText = (sal.basic + sal.hra + sal.allowances).toLocaleString();
            container.querySelector('#ps-deductions').innerText = sal.deductions.toLocaleString();
            container.querySelector('#ps-net').innerText = net.toLocaleString();

            openModal();
          }
        });
      });
    }
  }
}
