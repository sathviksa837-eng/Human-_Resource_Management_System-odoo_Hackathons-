/* Dayflow HRMS - Apple-Inspired Settings Module */
import { db } from './db.js';
import { Auth } from './auth.js';

export class Settings {
  static render(container, showToast) {
    const user = Auth.getCurrentUser();
    const isAdmin = Auth.isAdmin();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    const html = `
      <div class="settings-header-block mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <span>⚙️ System Preferences</span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Platform Settings</h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Configure workspace theme, attendance enforcement rules, company details, and security controls.</p>
      </div>

      <div class="max-w-4xl space-y-6">
        
        <!-- Appearance & Theme Section -->
        <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-bold">🎨</div>
            <div>
              <h2 class="font-bold text-zinc-900 dark:text-zinc-100 text-base">Appearance & Interface Theme</h2>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Switch between light slate and dark emerald themes across all screens.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div id="theme-card-light" class="p-4 rounded-xl border-2 cursor-pointer transition-all ${currentTheme === 'light' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30'} flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">☀️</span>
                <div>
                  <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">Light Mint Slate</div>
                  <div class="text-xs text-zinc-500 dark:text-zinc-400">Clean, crisp corporate light mode</div>
                </div>
              </div>
              ${currentTheme === 'light' ? '<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md">Active</span>' : ''}
            </div>

            <div id="theme-card-dark" class="p-4 rounded-xl border-2 cursor-pointer transition-all ${currentTheme === 'dark' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30'} flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🌙</span>
                <div>
                  <div class="font-bold text-sm text-zinc-900 dark:text-zinc-100">Dark Emerald Navy</div>
                  <div class="text-xs text-zinc-500 dark:text-zinc-400">High-tech dark mode for OLED screens</div>
                </div>
              </div>
              ${currentTheme === 'dark' ? '<span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md">Active</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Attendance Security & Rules Section -->
        <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg font-bold">🛡️</div>
            <div>
              <h2 class="font-bold text-zinc-900 dark:text-zinc-100 text-base">Attendance Rules & Protection</h2>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Enforce attendance integrity and prevent repeat punch cycles.</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
              <div>
                <strong class="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">Strict 1-Punch Per Day Attendance Rule</strong>
                <span class="text-xs text-zinc-500 dark:text-zinc-400">Restricts employees to exactly 1 Check-IN and 1 Check-OUT per calendar date.</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">Active Protection</span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60">
              <div>
                <strong class="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">Multi-HR Manager Structure</strong>
                <span class="text-xs text-zinc-500 dark:text-zinc-400">4 assigned HR Officers (Eleanor, Marcus, Sophia, David) for 28 employees.</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">Enforced</span>
            </div>
          </div>
        </div>

        <!-- Company Information Form -->
        <div class="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 shadow-sm">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-bold">🏢</div>
            <div>
              <h2 class="font-bold text-zinc-900 dark:text-zinc-100 text-base">Company Organization Info</h2>
              <p class="text-xs text-zinc-500 dark:text-zinc-400">Manage legal company title and payslip statement details.</p>
            </div>
          </div>

          <form id="form-settings-company" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Company Name</label>
                <input type="text" id="set-comp-name" value="Odoo India" class="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">System Version</label>
                <input type="text" value="Odoo Enterprise HR Operations v4.2" disabled class="w-full px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 cursor-not-allowed" />
              </div>
            </div>

            <div class="pt-2 text-right">
              <button type="submit" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all apple-btn-press shadow-sm">
                Save Platform Preferences
              </button>
            </div>
          </form>
        </div>

      </div>
    `;

    container.innerHTML = html;
    Settings.bindEvents(container, showToast);
  }

  static bindEvents(container, showToast) {
    // Theme Card Toggles
    const lightCard = container.querySelector('#theme-card-light');
    const darkCard = container.querySelector('#theme-card-dark');

    lightCard?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('odoo_theme', 'light');
      showToast('Switched to Light Mint Slate theme!', 'info');
      Settings.render(container, showToast);
    });

    darkCard?.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('odoo_theme', 'dark');
      showToast('Switched to Dark Emerald Navy theme!', 'info');
      Settings.render(container, showToast);
    });

    // Company Settings Submit
    container.querySelector('#form-settings-company')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newCompName = container.querySelector('#set-comp-name')?.value;
      if (newCompName) {
        showToast(`Company name updated to "${newCompName}"!`, 'success');
      }
    });
  }
}
