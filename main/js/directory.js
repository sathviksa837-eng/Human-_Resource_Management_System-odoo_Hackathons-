/* Dayflow HRMS - Apple-Inspired Employee Directory Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Directory {
  static currentViewMode = 'grid'; // 'grid' or 'list'
  static searchQuery = '';
  static selectedDept = 'all';
  static selectedHR = 'all';

  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();
    const allEmployees = db.getUsers().filter(u => u.status === 'approved' || u.role === 'admin');

    // Filter employees based on search & dropdowns
    const filteredEmps = allEmployees.filter(emp => {
      const matchQuery = !Directory.searchQuery ||
        emp.name.toLowerCase().includes(Directory.searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(Directory.searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(Directory.searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(Directory.searchQuery.toLowerCase());

      const matchDept = Directory.selectedDept === 'all' || emp.department === Directory.selectedDept;
      const matchHR = Directory.selectedHR === 'all' || String(emp.hrId) === String(Directory.selectedHR);

      return matchQuery && matchDept && matchHR;
    });

    const departments = Array.from(new Set(allEmployees.map(e => e.department).filter(Boolean)));
    const hrManagers = db.getHRs();

    const html = `
      <div class="directory-header-block mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>👥 Enterprise Workforce</span>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Employee Directory</h1>
            <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Discover team members, assigned HR managers, department roles, and direct contact details.</p>
          </div>

          <!-- Controls Bar: Search + Filter + Grid/List Switcher -->
          <div class="flex items-center gap-3">
            <div class="bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl flex items-center border border-zinc-200/80 dark:border-zinc-700/80">
              <button id="btn-view-grid" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all apple-btn-press ${Directory.currentViewMode === 'grid' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}">
                <span class="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Grid
                </span>
              </button>
              <button id="btn-view-list" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all apple-btn-press ${Directory.currentViewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'}">
                <span class="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  List
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-zinc-900/90 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <div class="relative">
            <input type="text" id="dir-search-input" value="${Directory.searchQuery}" placeholder="Search name, ID, or title..." class="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400" />
            <svg class="absolute left-3 top-2.5 text-zinc-400" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>

          <div>
            <select id="dir-dept-select" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100">
              <option value="all">All Departments (${departments.length})</option>
              ${departments.map(d => `<option value="${d}" ${Directory.selectedDept === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>

          <div>
            <select id="dir-hr-select" class="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100">
              <option value="all">All HR Managers (${hrManagers.length})</option>
              ${hrManagers.map(h => `<option value="${h.id}" ${String(Directory.selectedHR) === String(h.id) ? 'selected' : ''}>HR ${h.id}: ${h.name}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Directory View Output -->
      <div id="directory-content-wrapper">
        ${filteredEmps.length === 0 ? `
          <div class="text-center py-16 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80">
            <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center text-2xl mb-3">🔍</div>
            <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Employees Found</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try adjusting your search criteria or clear filters.</p>
          </div>
        ` : Directory.currentViewMode === 'grid' ? Directory.renderGridView(filteredEmps, hrManagers) : Directory.renderListView(filteredEmps, hrManagers)}
      </div>
    `;

    container.innerHTML = html;
    Directory.bindEvents(container, showToast);
  }

  static renderGridView(employees, hrManagers) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${employees.map(emp => {
      const hr = hrManagers.find(h => h.id === emp.hrId);
      const isHR = emp.role === 'admin';
      return `
            <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-sm apple-card-lift flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-3 mb-4">
                  <div class="flex items-center gap-3">
                    <img src="${emp.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + emp.name}" alt="${emp.name}" class="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700" />
                    <div>
                      <h3 class="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight">${emp.name}</h3>
                      <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">${emp.id}</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isHR ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}">
                    ${isHR ? 'HR Head' : 'Employee'}
                  </span>
                </div>

                <div class="space-y-2 mb-4">
                  <div class="text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                    <span class="text-zinc-400">Position:</span>
                    <span class="font-semibold">${emp.position}</span>
                  </div>
                  <div class="text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                    <span class="text-zinc-400">Department:</span>
                    <span class="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">${emp.department}</span>
                  </div>
                  <div class="text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                    <span class="text-zinc-400">Assigned HR:</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-semibold">${hr ? hr.name : 'HR ' + emp.hrId}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span class="text-[11px] text-zinc-400 font-medium">${emp.email}</span>
                <button class="btn-view-emp-profile px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-emerald-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-emerald-600 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all apple-btn-press" data-id="${emp.id}">
                  View Profile →
                </button>
              </div>
            </div>
          `;
    }).join('')}
      </div>
    `;
  }

  static renderListView(employees, hrManagers) {
    return `
      <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800/80 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th class="py-3.5 px-4">Employee</th>
                <th class="py-3.5 px-4">Employee Code</th>
                <th class="py-3.5 px-4">Role & Department</th>
                <th class="py-3.5 px-4">Assigned HR</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm">
              ${employees.map(emp => {
      const hr = hrManagers.find(h => h.id === emp.hrId);
      return `
                  <tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img src="${emp.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + emp.name}" alt="${emp.name}" class="w-9 h-9 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700" />
                        <div>
                          <div class="font-bold text-zinc-900 dark:text-zinc-100">${emp.name}</div>
                          <div class="text-xs text-zinc-400">${emp.position}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">${emp.id}</td>
                    <td class="py-3 px-4">
                      <span class="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        ${emp.department}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      ${hr ? hr.name : 'HR ' + emp.hrId}
                    </td>
                    <td class="py-3 px-4 text-xs text-zinc-400">
                      ${emp.email}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button class="btn-view-emp-profile px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all apple-btn-press" data-id="${emp.id}">
                        Profile →
                      </button>
                    </td>
                  </tr>
                `;
    }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  static bindEvents(container, showToast) {
    // Search Input Listener
    const searchInput = container.querySelector('#dir-search-input');
    searchInput?.addEventListener('input', (e) => {
      Directory.searchQuery = e.target.value;
      Directory.render(container, showToast);
    });

    // Department Select Listener
    const deptSelect = container.querySelector('#dir-dept-select');
    deptSelect?.addEventListener('change', (e) => {
      Directory.selectedDept = e.target.value;
      Directory.render(container, showToast);
    });

    // HR Select Listener
    const hrSelect = container.querySelector('#dir-hr-select');
    hrSelect?.addEventListener('change', (e) => {
      Directory.selectedHR = e.target.value;
      Directory.render(container, showToast);
    });

    // Grid View Toggle
    container.querySelector('#btn-view-grid')?.addEventListener('click', () => {
      Directory.currentViewMode = 'grid';
      Directory.render(container, showToast);
    });

    // List View Toggle
    container.querySelector('#btn-view-list')?.addEventListener('click', () => {
      Directory.currentViewMode = 'list';
      Directory.render(container, showToast);
    });

    // Profile Click Listeners
    container.querySelectorAll('.btn-view-emp-profile').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const empId = e.currentTarget.getAttribute('data-id');
        Directory.openProfilePopup(empId);
      });
    });
  }

  static openProfilePopup(empId) {
    const modal = document.getElementById('modal-emp-profile-popup');
    if (!modal) return;

    const emp = db.getUserById(empId);
    if (!emp) return;

    const hr = db.getUsers().find(u => String(u.id) === String(emp.hrId));

    const avatarElem = modal.querySelector('#pop-emp-avatar');
    const nameElem = modal.querySelector('#pop-emp-name');
    const codeElem = modal.querySelector('#pop-emp-code');
    const roleElem = modal.querySelector('#pop-emp-role');
    const positionElem = modal.querySelector('#pop-emp-position');
    const deptElem = modal.querySelector('#pop-emp-dept');
    const hrElem = modal.querySelector('#pop-emp-hr');
    const joinDateElem = modal.querySelector('#pop-emp-joindate');
    const emailElem = modal.querySelector('#pop-emp-email');
    const phoneElem = modal.querySelector('#pop-emp-phone');
    const addressElem = modal.querySelector('#pop-emp-address');
    const skillsElem = modal.querySelector('#pop-emp-skills');

    if (avatarElem) avatarElem.src = emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`;
    if (nameElem) nameElem.innerText = emp.name;
    if (codeElem) codeElem.innerText = emp.id;
    if (roleElem) roleElem.innerText = emp.role === 'admin' ? 'HR Head' : 'Employee';
    if (positionElem) positionElem.innerText = emp.position || 'Staff';
    if (deptElem) deptElem.innerText = emp.department || 'Operations';
    if (hrElem) hrElem.innerText = hr ? hr.name : `HR ${emp.hrId}`;
    if (joinDateElem) joinDateElem.innerText = emp.joinDate || '2023-01-15';
    if (emailElem) emailElem.innerText = emp.email;
    if (phoneElem) phoneElem.innerText = emp.phone || '+1 (555) 234-5678';
    if (addressElem) addressElem.innerText = emp.address || '742 Enterprise Blvd, Techville, CA';

    if (skillsElem) {
      const skillsList = emp.skills || ["JavaScript (ES6+)", "UI/UX Design", "System Operations", "Team Coordination"];
      skillsElem.innerHTML = skillsList.map(skill => `<span class="badge" style="background: var(--bg-surface-secondary); color: var(--text-main); font-size: 0.75rem; border: 1px solid var(--border-color);">${skill}</span>`).join('');
    }

    modal.classList.add('active');

    const closeModal = () => modal.classList.remove('active');
    const btnClose = modal.querySelector('#btn-close-pop-emp');
    const btnDismiss = modal.querySelector('#btn-dismiss-pop-emp');
    const btnFull = modal.querySelector('#btn-full-profile-pop');

    if (btnClose) btnClose.onclick = closeModal;
    if (btnDismiss) btnDismiss.onclick = closeModal;

    if (btnFull) {
      btnFull.onclick = () => {
        closeModal();
        if (window.AppOpenView) {
          window.AppOpenView('profile', emp.id);
        }
      };
    }
  }
}

