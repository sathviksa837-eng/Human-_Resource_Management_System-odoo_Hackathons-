/* Dayflow HRMS - Main Application Controller */
import { db, generateEmployeeID } from './db.js';
import { Auth } from './auth.js';
import { Dashboard } from './dashboard.js';
import { Profile } from './profile.js';
import { Attendance } from './attendance.js';
import { Leave } from './leave.js';
import { Payroll } from './payroll.js';
import { Projects } from './projects.js';
import { Analytics } from './analytics.js';

class App {
  static currentView = 'dashboard';
  static currentParam = null;
  static viewHistory = [];
  static activePortalMode = null; // 'employee' or 'admin'

  static init() {
    window.AppShowToast = App.showToast;
    Auth.logout(); // Always start on Sign In Page when opening link
    Auth.init();
    App.bindGlobalEvents();
    App.checkAuthStatus();
  }

  static openView(viewName, param = null) {
    if (App.currentView && (App.currentView !== viewName || App.currentParam !== param)) {
      App.viewHistory.push({ view: App.currentView, param: App.currentParam });
    }
    App.navigateTo(viewName, param);
  }

  static goBack() {
    if (App.viewHistory.length > 0) {
      const prev = App.viewHistory.pop();
      App.navigateTo(prev.view, prev.param);
    } else {
      App.navigateTo('dashboard');
    }
  }

  static checkAuthStatus() {
    const user = Auth.getCurrentUser();
    const authModal = document.getElementById('modal-auth');
    const portalModal = document.getElementById('modal-portal-select');
    const appShell = document.getElementById('app-shell');

    if (!user) {
      App.activePortalMode = null;
      window.AppActivePortalMode = null;
      if (appShell) appShell.style.display = 'none';
      if (portalModal) {
        portalModal.classList.remove('active');
        portalModal.style.display = 'none';
      }
      if (authModal) {
        authModal.style.display = 'flex';
        authModal.classList.add('active');
        const cardSignin = document.getElementById('card-signin');
        const cardSignup = document.getElementById('card-signup');
        if (cardSignin) cardSignin.style.display = 'block';
        if (cardSignup) cardSignup.style.display = 'none';
        const signinForm = document.getElementById('form-signin');
        if (signinForm) signinForm.reset();
      }
    } else {
      if (authModal) {
        authModal.classList.remove('active');
        authModal.style.display = 'none';
      }

      if (!App.activePortalMode) {
        const autoPortal = user.role === 'admin' ? 'admin' : 'employee';
        App.selectPortal(autoPortal);
      } else {
        if (portalModal) {
          portalModal.classList.remove('active');
          portalModal.style.display = 'none';
        }
        if (appShell) appShell.style.display = 'flex';
        App.updateUserHeader(user);
        App.navigateTo(App.currentView, App.currentParam);
      }
    }
  }

  static showPortalSelection(user) {
    const portalModal = document.getElementById('modal-portal-select');
    const userNameElem = document.getElementById('portal-user-name');
    const userRoleElem = document.getElementById('portal-user-role');
    if (userNameElem) userNameElem.innerText = user.name;
    if (userRoleElem) userRoleElem.innerText = `${user.position} (${user.id})`;

    if (portalModal) {
      portalModal.style.display = 'flex';
      portalModal.classList.add('active');
    }
  }

  static promptPortalAuth(mode) {
    const authModal = document.getElementById('modal-portal-auth');
    const titleElem = document.getElementById('portal-auth-title');
    const iconElem = document.getElementById('portal-auth-icon');
    const subtitleElem = document.getElementById('portal-auth-subtitle');
    const hintElem = document.getElementById('portal-auth-hint');
    const passwordInput = document.getElementById('portal-auth-password');
    const warningElem = document.getElementById('portal-auth-role-warning');

    if (modeInput) modeInput.value = mode;

    if (idInput) {
      idInput.value = '';
      idInput.placeholder = 'Enter email or Login ID';
    }
    if (passwordInput) {
      passwordInput.value = '';
      passwordInput.placeholder = 'Enter password';
    }

    if (mode === 'admin') {
      if (titleElem) titleElem.innerText = '🛡️ Admin & HR Portal Authentication';
      if (iconElem) iconElem.innerText = '🛡️';
      if (subtitleElem) subtitleElem.innerText = 'HR Administrator Credentials Required';
      if (hintElem) hintElem.innerText = 'Enter your Admin Employee ID and Password';
      if (warningElem) warningElem.style.display = 'block';
    } else {
      if (titleElem) titleElem.innerText = '💼 Employee Portal Authentication';
      if (iconElem) iconElem.innerText = '💼';
      if (subtitleElem) subtitleElem.innerText = 'Employee Workspace Sign In';
      if (hintElem) hintElem.innerText = 'Enter your Employee ID and Password';
      if (warningElem) warningElem.style.display = 'none';
    }

    const portalSelectModal = document.getElementById('modal-portal-select');
    if (portalSelectModal) {
      portalSelectModal.classList.remove('active');
      portalSelectModal.style.display = 'none';
    }

    if (authModal) {
      authModal.style.display = 'flex';
      authModal.classList.add('active');
    }
  }

  static closePortalAuth() {
    const authModal = document.getElementById('modal-portal-auth');
    if (authModal) {
      authModal.classList.remove('active');
      authModal.style.display = 'none';
    }
    const portalSelectModal = document.getElementById('modal-portal-select');
    if (portalSelectModal) {
      portalSelectModal.style.display = 'flex';
      portalSelectModal.classList.add('active');
    }
  }

  static selectPortal(mode) {
    App.activePortalMode = mode;
    window.AppActivePortalMode = mode;
    App.viewHistory = [];
    const portalModal = document.getElementById('modal-portal-select');
    if (portalModal) {
      portalModal.classList.remove('active');
      portalModal.style.display = 'none';
    }
    App.showToast(`Launched ${mode === 'admin' ? 'Admin & HR' : 'Employee'} Portal View!`, 'success');
    App.checkAuthStatus();
  }

  static updateBackButtonStyle() {
    const globalBackBtn = document.getElementById('btn-global-back');
    if (globalBackBtn) {
      if (App.currentView !== 'dashboard' || App.viewHistory.length > 0) {
        globalBackBtn.style.display = 'inline-flex';
      } else {
        globalBackBtn.style.display = 'none';
      }
    }
  }

  static updateUserHeader(user) {
    if (!user) return;
    const displayRole = App.activePortalMode === 'admin' ? `Admin HR Portal • ${user.id}` : `Employee Portal • ${user.id}`;
    const nameElem = document.getElementById('user-display-name');
    const roleElem = document.getElementById('user-display-role');
    const avatarElem = document.getElementById('user-avatar');
    if (nameElem) nameElem.innerText = user.name;
    if (roleElem) roleElem.innerText = displayRole;
    if (avatarElem) avatarElem.src = user.avatar;

    // Live Attendance Status Indicator Dot (Wireframe Spec: Red dot when checked out, Green dot when checked in!)
    const today = new Date().toISOString().split('T')[0];
    const userAttendance = db.getUserAttendance(user.id);
    const todayRecord = userAttendance.find(a => a.date === today);
    const isCheckedIn = todayRecord && todayRecord.checkIn !== '-' && todayRecord.checkOut === '-';

    const statusDot = document.getElementById('user-status-dot');
    const statusLabel = document.getElementById('dropdown-status-label');
    const checkinText = document.getElementById('dropdown-checkin-text');

    if (statusDot) {
      if (isCheckedIn) {
        statusDot.style.background = '#10b981';
        statusDot.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.8)';
        statusDot.title = 'Attendance Status: Checked IN (Present)';
      } else {
        statusDot.style.background = '#ef4444';
        statusDot.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.7)';
        statusDot.title = 'Attendance Status: Checked Out';
      }
    }

    if (statusLabel) {
      statusLabel.innerHTML = isCheckedIn ? '<span style="color: #10b981; font-weight: 700;">🟢 Checked IN</span>' : '<span style="color: #ef4444; font-weight: 700;">🔴 Checked Out</span>';
    }

    if (checkinText) {
      checkinText.innerText = isCheckedIn ? 'Check OUT →' : 'Check IN →';
    }
  }

  static showToast(message, type = 'primary') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>⚡</span>
      <div style="flex: 1;">${message}</div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  static navigateTo(viewName, param = null) {
    App.currentView = viewName;
    App.currentParam = param;
    const currentUser = Auth.getCurrentUser();
    if (!currentUser) {
      App.checkAuthStatus();
      return;
    }

    App.updateBackButtonStyle();

    // Update Nav Active State
    document.querySelectorAll('.nav-tab-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));

    // Render target view
    const targetSection = document.getElementById(`sec-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');

      switch (viewName) {
        case 'dashboard':
          Dashboard.render(targetSection, (v, p) => App.openView(v, p));
          break;
        case 'profile':
          Profile.render(targetSection, param, App.showToast);
          break;
        case 'attendance':
          Attendance.render(targetSection, App.showToast);
          break;
        case 'leave':
          Leave.render(targetSection, App.showToast);
          break;
        case 'payroll':
          Payroll.render(targetSection, App.showToast);
          break;
        case 'projects':
          Projects.render(targetSection, App.showToast);
          break;
        case 'analytics':
          Analytics.render(targetSection);
          break;
      }
    }
  }

  static bindGlobalEvents() {
    // Top Nav Tab Click Events
    document.querySelectorAll('.nav-tab-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        App.openView(view);
      });
    });

    // Global Back Button Listener
    document.addEventListener('click', (e) => {
      if (e.target.closest('#btn-global-back') || e.target.closest('.btn-page-back') || e.target.closest('#btn-back-dashboard')) {
        App.goBack();
      }
    });

    // Password Show/Hide Toggle Buttons (.btn-toggle-pw-square and .btn-toggle-pw)
    document.querySelectorAll('.btn-toggle-pw-square, .btn-toggle-pw').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            e.currentTarget.innerText = '🙈';
          } else {
            input.type = 'password';
            e.currentTarget.innerText = '👁️';
          }
        }
      });
    });

    // View Mode Switcher (Stacked Card View vs Side-by-Side Wireframe View)
    const btnStacked = document.getElementById('btn-view-stacked');
    const btnWireframe = document.getElementById('btn-view-wireframe');
    const authModalContainer = document.getElementById('auth-wireframe-modal');
    const authCardsGrid = document.getElementById('auth-cards-grid');
    const cardSignin = document.getElementById('card-signin');
    const cardSignup = document.getElementById('card-signup');

    btnStacked?.addEventListener('click', () => {
      btnStacked.classList.add('active');
      btnWireframe?.classList.remove('active');
      authModalContainer?.classList.remove('side-by-side-mode');
      authCardsGrid?.classList.remove('side-by-side');
      cardSignin.style.display = 'block';
      cardSignup.style.display = 'none';
    });

    btnWireframe?.addEventListener('click', () => {
      btnWireframe.classList.add('active');
      btnStacked?.classList.remove('active');
      authModalContainer?.classList.add('side-by-side-mode');
      authCardsGrid?.classList.add('side-by-side');
      cardSignin.style.display = 'block';
      cardSignup.style.display = 'block';
    });

    // Toggle Sign In / Sign Up Card Links in Stacked Mode
    document.getElementById('link-show-signup')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!authCardsGrid?.classList.contains('side-by-side')) {
        cardSignin.style.display = 'none';
        cardSignup.style.display = 'block';
      }
    });

    document.getElementById('link-show-signin')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!authCardsGrid?.classList.contains('side-by-side')) {
        cardSignup.style.display = 'none';
        cardSignin.style.display = 'block';
      }
    });

    // Real-Time Login ID Preview in Sign Up Form
    const signupNameInput = document.getElementById('signup-name-input');
    const signupCompanyNameInput = document.getElementById('signup-company-name');
    const signupGenIdDisplay = document.getElementById('signup-gen-id-display');

    const updateSignUpGenID = () => {
      const name = signupNameInput ? signupNameInput.value.trim() : 'John Doe';
      const company = signupCompanyNameInput ? signupCompanyNameInput.value.trim() : 'Odoo India';
      const allUsers = db.getUsers();
      const genID = generateEmployeeID(name || 'John Doe', new Date().toISOString(), allUsers);
      if (signupGenIdDisplay) signupGenIdDisplay.innerText = genID;
    };

    signupNameInput?.addEventListener('input', updateSignUpGenID);
    signupCompanyNameInput?.addEventListener('input', updateSignUpGenID);
    updateSignUpGenID();

    // Company Logo Upload Handler
    const btnTriggerUploadLogo = document.getElementById('btn-trigger-upload-logo');
    const companyLogoFileInput = document.getElementById('company-logo-file-input');

    btnTriggerUploadLogo?.addEventListener('click', () => {
      companyLogoFileInput?.click();
    });

    companyLogoFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const logoSrc = event.target.result;

          // Update logo images on both cards
          ['signin', 'signup'].forEach(prefix => {
            const imgElem = document.getElementById(`${prefix}-app-logo`);
            const textElem = document.getElementById(`${prefix}-logo-text`);
            if (imgElem && textElem) {
              imgElem.src = logoSrc;
              imgElem.style.display = 'block';
              textElem.style.display = 'none';
            }
          });
          App.showToast('Company logo uploaded successfully!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });

    // Live Employee ID Generator Preview in Add Employee Modal
    const addNameInput = document.getElementById('add-emp-name');
    const addJoinInput = document.getElementById('add-emp-joindate');
    const previewIdElem = document.getElementById('preview-gen-id');

    const updatePreviewID = () => {
      const name = addNameInput ? addNameInput.value : 'John Doe';
      const joinDate = addJoinInput ? addJoinInput.value : '2026-08-22';
      const allUsers = db.getUsers();
      const genID = generateEmployeeID(name.trim() || 'John Doe', joinDate, allUsers);
      if (previewIdElem) previewIdElem.innerText = genID;
    };

    addNameInput?.addEventListener('input', updatePreviewID);
    addJoinInput?.addEventListener('change', updatePreviewID);

    // Sign In Form Handler
    document.getElementById('form-signin')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        const user = Auth.login(formData.get('emailOrId'), formData.get('password'));
        const autoPortal = user.role === 'admin' ? 'admin' : 'employee';
        App.showToast(`Welcome back, ${user.name}! Logging into ${user.role === 'admin' ? 'Admin HR' : 'Employee'} Portal.`, 'success');
        App.selectPortal(autoPortal);
      } catch (err) {
        App.showToast(err.message, 'danger');
      }
    });

    // Sign Up Form Handler (Candidate Job Application -> Pending HR Approval)
    document.getElementById('form-signup')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        const data = Object.fromEntries(formData.entries());
        data.hrId = Number(data.hrId || 1);
        const newUser = Auth.register(data, false); // isHrCreation = false (Pending HR Approval)
        App.showToast(`📋 Registration submitted for '${newUser.name}' under selected HR Manager! Your application is pending HR approval under "New Applicants".`, 'info');
        
        // Show Sign In card
        const cardSignup = document.getElementById('card-signup');
        const cardSignin = document.getElementById('card-signin');
        if (cardSignup) cardSignup.style.display = 'none';
        if (cardSignin) cardSignin.style.display = 'block';
        const signupForm = document.getElementById('form-signup');
        if (signupForm) signupForm.reset();
      } catch (err) {
        App.showToast(err.message, 'danger');
      }
    });

    // Admin Add Employee Form Handler (HR Direct Creation -> Auto Approved with Instant ID)
    document.getElementById('form-admin-add-emp')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        const data = Object.fromEntries(formData.entries());
        const newUser = Auth.register(data, true); // isHrCreation = true (Instant Approval & ID)
        document.getElementById('modal-add-employee')?.classList.remove('active');
        App.showToast(`✅ Employee Created! Generated Employee ID: ${newUser.id}`, 'success');
        App.navigateTo('dashboard');
      } catch (err) {
        App.showToast(err.message, 'danger');
      }
    });

    // Close Add Employee Modal
    document.getElementById('btn-close-add-emp-modal')?.addEventListener('click', () => {
      document.getElementById('modal-add-employee')?.classList.remove('active');
    });
    document.getElementById('btn-cancel-add-emp-modal')?.addEventListener('click', () => {
      document.getElementById('modal-add-employee')?.classList.remove('active');
    });

    // Doc Preview Modal Close
    document.getElementById('btn-close-doc-modal')?.addEventListener('click', () => {
      document.getElementById('modal-doc-preview')?.classList.remove('active');
    });
    document.getElementById('btn-dismiss-doc-modal')?.addEventListener('click', () => {
      document.getElementById('modal-doc-preview')?.classList.remove('active');
    });
    document.getElementById('btn-download-doc')?.addEventListener('click', () => {
      App.showToast('Downloading document archive...', 'info');
      document.getElementById('modal-doc-preview')?.classList.remove('active');
    });

    // Post-Login Portal Selection Handlers
    const handlePortalChoice = (mode) => {
      const user = Auth.getCurrentUser();
      if (user) {
        if (mode === 'admin' && user.role !== 'admin') {
          App.showToast('Access Denied: Admin portal is restricted to HR Administrators.', 'danger');
          return;
        }
        App.selectPortal(mode);
      } else {
        App.promptPortalAuth(mode);
      }
    };

    document.getElementById('card-option-employee')?.addEventListener('click', () => handlePortalChoice('employee'));
    document.getElementById('btn-launch-employee')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePortalChoice('employee');
    });

    document.getElementById('card-option-admin')?.addEventListener('click', () => handlePortalChoice('admin'));
    document.getElementById('btn-launch-admin')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePortalChoice('admin');
    });

    // Portal Credential Authentication Submission
    document.getElementById('form-portal-auth')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const emailOrId = formData.get('emailOrId');
      const password = formData.get('password');
      const targetMode = formData.get('targetMode');

      try {
        const user = Auth.login(emailOrId, password);

        // STRICT SINGLE-PORTAL SECURITY RULE: HR -> HR Portal ONLY, Employees -> Employee Portal ONLY
        if (targetMode === 'admin' && user.role !== 'admin') {
          Auth.logout();
          throw new Error(`🚫 Access Denied: User '${user.name}' (${user.id}) is an Employee. Employee accounts are restricted to the Employee Portal only.`);
        }

        if (targetMode === 'employee' && user.role === 'admin') {
          Auth.logout();
          throw new Error(`🚫 Access Denied: User '${user.name}' (${user.id}) is an HR Administrator. HR Administrator accounts are restricted to the Admin HR Portal only.`);
        }

        const authModal = document.getElementById('modal-portal-auth');
        if (authModal) {
          authModal.classList.remove('active');
          authModal.style.display = 'none';
        }

        App.selectPortal(targetMode);
      } catch (err) {
        App.showToast(err.message, 'danger');
      }
    });

    // Close / Cancel Portal Auth Modal
    document.getElementById('btn-close-portal-auth')?.addEventListener('click', App.closePortalAuth);
    document.getElementById('btn-cancel-portal-auth')?.addEventListener('click', App.closePortalAuth);

    // Back to Login from Portal Selection Modal
    document.getElementById('btn-portal-back')?.addEventListener('click', () => {
      App.activePortalMode = null;
      window.AppActivePortalMode = null;
      Auth.logout();
      App.showToast('Returned to Sign In screen', 'info');
      App.checkAuthStatus();
    });



    // User Profile Dropdown Toggle & Systray Menu (Image 2 Wireframe Specs)
    const userMenuTrigger = document.getElementById('user-menu-trigger');
    const userDropdown = document.getElementById('user-dropdown');

    userMenuTrigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (userDropdown) {
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
      }
    });

    document.addEventListener('click', () => {
      if (userDropdown) userDropdown.style.display = 'none';
    });

    // Dropdown Item: My Profile
    document.getElementById('dropdown-my-profile')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.openView('profile');
    });

    // Dropdown Item: Check IN / Check OUT Systray Toggle
    document.getElementById('dropdown-checkin-toggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userAttendance = db.getUserAttendance(user.id);
      const todayRecord = userAttendance.find(a => a.date === today);

      if (todayRecord && todayRecord.checkIn !== '-' && todayRecord.checkOut === '-') {
        // Punch Out -> Red status dot
        todayRecord.checkOut = timeNow;
        db.updateAttendanceRecord(todayRecord);
        App.showToast(`Checked OUT successfully at ${timeNow}! Status indicator updated to Red 🔴`, 'info');
      } else {
        // Punch In -> Green status dot
        if (todayRecord) {
          todayRecord.checkIn = timeNow;
          todayRecord.checkOut = '-';
          todayRecord.status = 'Present';
          db.updateAttendanceRecord(todayRecord);
        } else {
          const newRecord = {
            id: `att-${Date.now()}`,
            userId: user.id,
            date: today,
            checkIn: timeNow,
            checkOut: '-',
            workHours: 'In Progress',
            status: 'Present'
          };
          db.addAttendanceRecord(newRecord);
        }
        App.showToast(`Checked IN successfully at ${timeNow}! Status indicator updated to Green 🟢`, 'success');
      }

      App.updateUserHeader(user);
      App.navigateTo(App.currentView, App.currentParam);
    });

    // Dropdown Item: Logout
    document.getElementById('dropdown-logout')?.addEventListener('click', (e) => {
      e.preventDefault();
      App.activePortalMode = null;
      window.AppActivePortalMode = null;
      Auth.logout();
      App.showToast('Signed out successfully.', 'info');
      App.checkAuthStatus();
    });

    // Theme Toggle (Dark / Light)
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.getElementById('btn-theme-toggle').innerText = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
