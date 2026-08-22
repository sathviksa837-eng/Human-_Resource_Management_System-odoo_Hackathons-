/* Dayflow HRMS - Projects & Workforce Allocation Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Projects {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();
    const currentHrId = user.hrId || 1;

    const projects = db.getHRProjects(isAdmin ? currentHrId : null);
    const hrEmployees = db.getApprovedUsers(currentHrId);
    const allUsers = db.getUsers();

    const totalProjectsCount = projects.length;
    const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
    const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
    const upcomingProjectsCount = projects.filter(p => p.status === 'Upcoming').length;

    const html = `
      <!-- Top Title Bar & Actions -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; display: flex; align-items: center; gap: 0.6rem;">
            <span>📁 Projects & Workforce Allocation</span>
          </h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.2rem;">
            Monitor total projects, track progress, and manage which employee is working under which project.
          </p>
        </div>

        ${isAdmin ? `
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary" id="btn-open-assign-modal" style="font-weight: 700;">
              👥 Assign Employee to Project
            </button>
            <button class="btn btn-purple" id="btn-open-create-proj-modal" style="font-weight: 800;">
              + Create New Project
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Top Metric Cards Grid (Matching HR Management Dashboard Template) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
        
        <!-- Total Projects Card -->
        <div class="card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Total Projects</span>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0 0;">${totalProjectsCount}</h2>
            </div>
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(147, 51, 234, 0.15); border: 1px solid var(--primary-accent); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              📁
            </div>
          </div>
          <div style="font-size: 0.825rem; color: var(--primary-accent); font-weight: 600;">
            Currently active: <strong>${activeProjectsCount} Projects</strong> in progress
          </div>
        </div>

        <!-- Project Status Breakdown Card -->
        <div class="card" style="padding: 1.25rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.75rem;">Status Distribution</span>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b;"></span>In Progress</span>
              <strong style="color: #f59e0b;">${activeProjectsCount}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>Completed</span>
              <strong style="color: #10b981;">${completedProjectsCount}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="display: flex; align-items: center; gap: 0.35rem;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #3b82f6;"></span>Upcoming</span>
              <strong style="color: #3b82f6;">${upcomingProjectsCount}</strong>
            </div>
          </div>
        </div>

        <!-- Assigned Workforce Count Card -->
        <div class="card" style="padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Assigned Employees</span>
              <h2 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0 0 0;">${hrEmployees.length} Staff</h2>
            </div>
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              👥
            </div>
          </div>
          <div style="font-size: 0.825rem; color: var(--status-present); font-weight: 600;">
            100% Allocated across department projects
          </div>
        </div>
      </div>

      <!-- Project Summary Table (Matching Wireframe Image Center Section) -->
      <div class="card" style="margin-bottom: 1.75rem;">
        <div class="card-header" style="flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 class="card-title">Project Summary & Employee Assignments</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.15rem;">
              Detailed breakdown of active projects and assigned team members.
            </p>
          </div>
        </div>

        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Project ID & Name</th>
                <th>Assigned Team Members</th>
                <th>Department</th>
                <th>Project Cost / Budget</th>
                <th>Project Status</th>
                <th>Target Deadline</th>
                ${isAdmin ? '<th>Action</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${projects.map(p => {
                const assignedEmpObjs = (p.assignedEmployees || []).map(id => allUsers.find(u => u.id === id)).filter(Boolean);
                return `
                  <tr>
                    <td>
                      <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary-accent); font-family: monospace;">${p.id}</div>
                      <strong style="font-size: 0.95rem; color: var(--text-main);">${p.name}</strong>
                    </td>
                    <td>
                      <!-- Employee Avatars Stack -->
                      <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                        ${assignedEmpObjs.map(emp => `
                          <div style="display: flex; align-items: center; gap: 0.35rem; background: var(--bg-surface-secondary); padding: 0.2rem 0.5rem; border-radius: var(--radius-full); border: 1px solid var(--border-color);" title="${emp.name} (${emp.position})">
                            <img src="${emp.avatar}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;" />
                            <span style="font-size: 0.78rem; font-weight: 600;">${emp.name}</span>
                          </div>
                        `).join('')}
                        ${assignedEmpObjs.length === 0 ? '<em style="color: var(--text-muted); font-size: 0.8rem;">Unassigned</em>' : ''}
                      </div>
                    </td>
                    <td><span class="badge badge-purple">${p.department}</span></td>
                    <td><strong style="color: var(--text-main); font-family: monospace;">${p.budget}</strong></td>
                    <td>
                      <span class="badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'In Progress' ? 'badge-warning' : 'badge-primary'}">
                        ${p.status === 'Completed' ? '🟢 Completed' : p.status === 'In Progress' ? '🟠 In Progress' : '🔵 Upcoming'}
                      </span>
                    </td>
                    <td><span style="font-size: 0.85rem; color: var(--text-muted); font-family: monospace;">${p.deadline}</span></td>
                    ${isAdmin ? `
                      <td>
                        <button class="btn btn-secondary btn-sm btn-quick-assign-proj" data-id="${p.id}" data-name="${p.name}">
                          ⚙️ Manage Team
                        </button>
                      </td>
                    ` : ''}
                  </tr>
                `;
              }).join('')}
              ${projects.length === 0 ? '<tr><td colspan="7" style="text-align: center; padding: 1.5rem;">No projects registered under this department yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Assign Employee to Project Modal -->
      <div class="modal-overlay" id="modal-assign-project">
        <div class="modal" style="max-width: 520px; border-radius: var(--radius-lg);">
          <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 800;">Assign Employee to Project</h3>
            <button class="btn btn-secondary btn-sm" id="btn-close-assign-modal">✕</button>
          </div>

          <form id="form-assign-project">
            <div class="modal-body" style="padding: 1.25rem 0;">
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Select Target Project</label>
                <select class="form-control" name="projectId" id="select-assign-proj-id" required style="font-weight: 700;">
                  ${projects.map(p => `<option value="${p.id}">${p.id} - ${p.name}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Select Employee (Department Staff)</label>
                <select class="form-control" name="userId" required style="font-weight: 600;">
                  ${hrEmployees.map(e => `<option value="${e.id}">${e.name} (${e.id}) - ${e.position}</option>`).join('')}
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Action</label>
                <select class="form-control" name="actionType" style="font-weight: 700;">
                  <option value="assign">➕ Add Employee to Project Team</option>
                  <option value="remove">➖ Remove Employee from Project Team</option>
                </select>
              </div>
            </div>

            <div class="modal-footer" style="border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
              <button type="submit" class="btn btn-purple" style="font-weight: 700;">Save Project Assignment</button>
              <button type="button" class="btn btn-secondary" id="btn-cancel-assign-modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create New Project Modal -->
      <div class="modal-overlay" id="modal-create-project">
        <div class="modal" style="max-width: 540px; border-radius: var(--radius-lg);">
          <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
            <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 800;">Create New Department Project</h3>
            <button class="btn btn-secondary btn-sm" id="btn-close-create-proj-modal">✕</button>
          </div>

          <form id="form-create-project">
            <div class="modal-body" style="padding: 1.25rem 0;">
              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Project Name</label>
                <input type="text" class="form-control" name="projectName" placeholder="e.g. AI Workflow Optimization" required />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;">Project Budget ($)</label>
                  <input type="text" class="form-control" name="budget" placeholder="$35,000" required />
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-weight: 600;">Target Deadline</label>
                  <input type="date" class="form-control" name="deadline" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" style="font-weight: 600;">Initial Project Status</label>
                <select class="form-control" name="status" style="font-weight: 700;">
                  <option value="In Progress">In Progress</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div class="modal-footer" style="border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
              <button type="submit" class="btn btn-purple" style="font-weight: 700;">Create Project</button>
              <button type="button" class="btn btn-secondary" id="btn-cancel-create-proj-modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Modal Triggers
    const assignModal = container.querySelector('#modal-assign-project');
    const createModal = container.querySelector('#modal-create-project');

    container.querySelector('#btn-open-assign-modal')?.addEventListener('click', () => assignModal?.classList.add('active'));
    container.querySelector('#btn-close-assign-modal')?.addEventListener('click', () => assignModal?.classList.remove('active'));
    container.querySelector('#btn-cancel-assign-modal')?.addEventListener('click', () => assignModal?.classList.remove('active'));

    container.querySelector('#btn-open-create-proj-modal')?.addEventListener('click', () => createModal?.classList.add('active'));
    container.querySelector('#btn-close-create-proj-modal')?.addEventListener('click', () => createModal?.classList.remove('active'));
    container.querySelector('#btn-cancel-create-proj-modal')?.addEventListener('click', () => createModal?.classList.remove('active'));

    // Quick Assign Button in Table
    container.querySelectorAll('.btn-quick-assign-proj').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.getAttribute('data-id');
        const select = container.querySelector('#select-assign-proj-id');
        if (select) select.value = projId;
        assignModal?.classList.add('active');
      });
    });

    // Handle Assign Form Submission
    const assignForm = container.querySelector('#form-assign-project');
    assignForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(assignForm);
      const projId = formData.get('projectId');
      const userId = formData.get('userId');
      const actionType = formData.get('actionType');

      const targetEmp = allUsers.find(u => u.id === userId);

      if (actionType === 'assign') {
        db.assignEmployeeToProject(projId, userId);
        if (showToast) showToast(`Assigned ${targetEmp ? targetEmp.name : userId} to ${projId}!`, 'success');
      } else {
        db.removeEmployeeFromProject(projId, userId);
        if (showToast) showToast(`Removed ${targetEmp ? targetEmp.name : userId} from ${projId}.`, 'warning');
      }

      assignModal?.classList.remove('active');
      Projects.render(container, showToast);
    });

    // Handle Create Project Submission
    const createForm = container.querySelector('#form-create-project');
    createForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(createForm);
      const newProj = {
        id: 'PRJ-' + Math.floor(1000 + Math.random() * 9000),
        hrId: currentHrId,
        name: formData.get('projectName'),
        department: user.department || 'Engineering',
        budget: formData.get('budget'),
        status: formData.get('status'),
        deadline: formData.get('deadline'),
        assignedEmployees: []
      };

      db.addProject(newProj);
      createModal?.classList.remove('active');
      if (showToast) showToast(`New project '${newProj.name}' created!`, 'success');
      Projects.render(container, showToast);
    });
  }
}
