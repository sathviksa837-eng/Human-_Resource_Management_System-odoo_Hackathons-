/* Dayflow HRMS - HR Analytics & Reports Module */
import { db } from './db.js';

export class Analytics {
  static render(container) {
    const users = db.getUsers();
    const attendance = db.getAttendance();
    const leaves = db.getLeaves();

    // Department distribution calculation
    const depts = {};
    users.forEach(u => {
      depts[u.department] = (depts[u.department] || 0) + 1;
    });

    // Leave status breakdown
    const leaveStatus = { Pending: 0, Approved: 0, Rejected: 0 };
    leaves.forEach(l => {
      leaveStatus[l.status] = (leaveStatus[l.status] || 0) + 1;
    });

    // Department payroll breakdown
    const deptPayroll = {};
    users.forEach(u => {
      const sal = u.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
      const net = sal.basic + sal.hra + sal.allowances - sal.deductions;
      deptPayroll[u.department] = (deptPayroll[u.department] || 0) + net;
    });

    const html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800;">HR Analytics & Executive Reports</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Visual insights into headcount, attendance trends, and leave distributions.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-secondary" id="btn-export-att-csv">
            📊 Export Attendance CSV
          </button>
          <button class="btn btn-primary" id="btn-export-payroll-csv">
            💵 Export Payroll CSV
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <!-- Department Distribution Chart -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Department Headcount Distribution</h3>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; height: 230px;">
            <canvas id="chart-dept" width="280" height="210"></canvas>
          </div>
          <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.8rem; flex-wrap: wrap;">
            ${Object.keys(depts).map((d, i) => `
              <span style="display: flex; align-items: center; gap: 0.35rem;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${['#714b67', '#00a09d', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]};"></span>
                ${d} (${depts[d]})
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Leave Requests Breakdown -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Leave Request Status Breakdown</h3>
          </div>
          <div style="display: flex; justify-content: center; align-items: center; height: 230px;">
            <canvas id="chart-leaves" width="280" height="210"></canvas>
          </div>
          <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; font-size: 0.8rem;">
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span> Pending (${leaveStatus.Pending})</span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span> Approved (${leaveStatus.Approved})</span>
            <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444;"></span> Rejected (${leaveStatus.Rejected})</span>
          </div>
        </div>
      </div>

      <!-- Salary Allocation Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Monthly Payroll Allocation by Department</h3>
        </div>
        <div style="padding: 1rem 0;">
          ${Object.keys(deptPayroll).map(d => {
            const amount = deptPayroll[d];
            const maxVal = Math.max(...Object.values(deptPayroll), 1);
            const pct = Math.round((amount / maxVal) * 100);
            return `
              <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                  <strong>${d}</strong>
                  <span>$${amount.toLocaleString()} / mo</span>
                </div>
                <div style="background: var(--bg-surface-secondary); height: 10px; border-radius: var(--radius-full); overflow: hidden;">
                  <div style="background: var(--primary); height: 100%; width: ${pct}%; border-radius: var(--radius-full); transition: width 0.5s ease-in-out;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Draw Canvas Charts
    setTimeout(() => {
      Analytics.drawPieChart('chart-dept', Object.values(depts), ['#714b67', '#00a09d', '#10b981', '#f59e0b', '#8b5cf6']);
      Analytics.drawPieChart('chart-leaves', [leaveStatus.Pending, leaveStatus.Approved, leaveStatus.Rejected], ['#f59e0b', '#10b981', '#ef4444']);
    }, 50);

    // Attach CSV Export triggers
    container.querySelector('#btn-export-att-csv')?.addEventListener('click', () => {
      Analytics.exportToCSV('attendance_report.csv', [
        ['ID', 'User ID', 'Date', 'Check In', 'Check Out', 'Work Hours', 'Status'],
        ...attendance.map(a => [a.id, a.userId, a.date, a.checkIn, a.checkOut, a.workHours, a.status])
      ]);
    });

    container.querySelector('#btn-export-payroll-csv')?.addEventListener('click', () => {
      Analytics.exportToCSV('payroll_report.csv', [
        ['Employee ID', 'Name', 'Department', 'Position', 'Basic Pay', 'HRA', 'Allowances', 'Deductions', 'Net Pay'],
        ...users.map(u => {
          const s = u.salary || { basic: 0, hra: 0, allowances: 0, deductions: 0 };
          const net = s.basic + s.hra + s.allowances - s.deductions;
          return [u.id, u.name, u.department, u.position, s.basic, s.hra, s.allowances, s.deductions, net];
        })
      ]);
    });
  }

  static drawPieChart(canvasId, values, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = values.reduce((a, b) => a + b, 0) || 1;

    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    values.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.52, 0, 2 * Math.PI);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-surface') || '#ffffff';
    ctx.fill();
  }

  static exportToCSV(filename, rows) {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
