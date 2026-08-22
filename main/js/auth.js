/* Dayflow HRMS - Auth Module */
import { db, generateEmployeeID } from './db.js';

export class Auth {
  static currentUser = null;

  static init() {
    Auth.currentUser = db.getSession();
    return Auth.currentUser;
  }

  static login(emailOrId, password) {
    const users = db.getUsers();
    const target = emailOrId.trim().toLowerCase();
    
    const user = users.find(u => 
      (u.email.toLowerCase() === target || u.id.toLowerCase() === target) && 
      u.password === password
    );

    if (!user) {
      throw new Error('Invalid email/Login ID or password.');
    }

    if (user.status === 'pending' || !user.verified) {
      throw new Error('⏳ Your sign-up request is pending HR approval under "New Applicants". You will receive your Employee ID once HR approves your application.');
    }

    Auth.currentUser = user;
    db.setSession(user);
    return user;
  }

  static register(userData, isHrCreation = false) {
    const { companyName, name, email, phone, password, confirmPassword, role, department, position, joinDate } = userData;

    if (!name || !email || !password) {
      throw new Error('Please fill in all required fields.');
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new Error('Password and Confirm Password do not match.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const existingEmail = db.getUserByEmail(email);
    if (existingEmail) {
      throw new Error('An account with this email address already exists.');
    }

    const allUsers = db.getUsers();
    const isApproved = Boolean(isHrCreation);

    // Only issue generated Employee ID immediately if created directly by HR!
    // Self-service sign ups receive Employee ID upon HR approval.
    const generatedId = isApproved 
      ? generateEmployeeID(name, joinDate || new Date().toISOString(), db.getApprovedUsers()) 
      : 'PENDING';

    const newUser = {
      id: generatedId,
      hrId: Number(userData.hrId || 1),
      name,
      email,
      password,
      role: role || 'employee',
      companyName: companyName || 'Odoo India',
      department: department || 'General',
      position: position || 'Team Member',
      phone: phone || '+1 (555) 000-0000',
      address: 'Pending address update',
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      salary: { basic: 4500, hra: 1500, allowances: 800, deductions: 400 },
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      leaveBalance: { paid: 15, sick: 10, casual: 5, unpaid: 0 },
      verified: isApproved,
      status: isApproved ? 'approved' : 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    db.saveUser(newUser);
    return newUser;
  }

  static changePassword(userId, currentPassword, newPassword) {
    const user = db.getUserById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect.');
    }
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    user.password = newPassword;
    db.saveUser(user);
    return user;
  }

  static logout() {
    Auth.currentUser = null;
    db.clearSession();
  }

  static getCurrentUser() {
    return Auth.currentUser || db.getSession();
  }

  static isAdmin() {
    const u = Auth.getCurrentUser();
    return u && u.role === 'admin';
  }
}
