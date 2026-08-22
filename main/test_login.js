const fs = require('fs');

// We need a minimal mock of localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}
global.localStorage = new LocalStorageMock();

// Load the module content using dynamic import
(async () => {
  try {
    // We can't easily import ES modules in a CJS script without setup, 
    // but since we just want to run db.js, let's read it and eval it
    const dbSource = fs.readFileSync('d:/ODOO/js/db.js', 'utf8');
    const authSource = fs.readFileSync('d:/ODOO/js/auth.js', 'utf8');
    
    // Convert ES6 export to global objects
    const runDb = dbSource.replace(/export /g, '');
    eval(runDb);
    
    // Now test init
    db.init();
    
    const runAuth = authSource.replace(/import .*/g, '').replace(/export /g, '');
    eval(runAuth);
    
    // Test login
    const user = Auth.login('hr.eleanor@dayflow.com', 'password123');
    console.log("Login successful:", user.name);
  } catch (err) {
    console.error("ERROR CAUGHT:", err);
  }
})();
