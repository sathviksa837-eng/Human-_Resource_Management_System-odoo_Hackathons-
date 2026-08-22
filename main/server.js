/**
 * Dayflow HRMS - Express & MySQL API Backend Server
 * Connecting MySQL Relational Database to Dayflow HRMS Client
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dayflow_hrms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ MySQL Database Connection Pool Established!');
  } catch (err) {
    console.error('⚠️ MySQL Connection Warning:', err.message);
  }
}

initDB();

// ------------------------------------------------------------
// API Endpoint: Get All HR Managers (For Candidate Registration Selection)
// ------------------------------------------------------------
app.get('/api/hrs', async (req, res) => {
  try {
    const [hrs] = await pool.query('SELECT id, hr_code, name, email, department, position, avatar FROM hrs ORDER BY id ASC');
    res.json({ success: true, hrs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------------------------------------
// API Endpoint: Get Employees by HR ID
// ------------------------------------------------------------
app.get('/api/hrs/:hrId/employees', async (req, res) => {
  const { hrId } = req.params;
  try {
    const [employees] = await pool.query(
      "SELECT * FROM employees WHERE hr_id = ? AND status = 'approved' ORDER BY id ASC",
      [hrId]
    );
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------------------------------------
// API Endpoint: Get Pending Applicants for Specific HR Manager
// ------------------------------------------------------------
app.get('/api/hrs/:hrId/applicants', async (req, res) => {
  const { hrId } = req.params;
  try {
    const [applicants] = await pool.query(
      "SELECT * FROM employees WHERE hr_id = ? AND status = 'pending' ORDER BY id DESC",
      [hrId]
    );
    res.json({ success: true, applicants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------------------------------------
// API Endpoint: Candidate Job Sign-Up (Assigned to Selected HR)
// ------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, hrId, department, position } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM employees WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const tempCode = `PENDING-${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const today = new Date().toISOString().split('T')[0];

    const [result] = await pool.query(
      `INSERT INTO employees (employee_code, hr_id, name, email, password, role, department, position, phone, avatar, status, verified, applied_date)
       VALUES (?, ?, ?, ?, ?, 'employee', ?, ?, ?, ?, 'pending', 0, ?)`,
      [tempCode, hrId || 1, name, email, password, department || 'General', position || 'Team Member', phone, avatar, today]
    );

    res.json({ success: true, message: 'Registration application submitted to HR manager for approval!', applicantId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------------------------------------
// API Endpoint: HR Approves Applicant & Generates Employee ID
// ------------------------------------------------------------
app.post('/api/approve-applicant', async (req, res) => {
  const { applicantId, hrId } = req.body;
  try {
    const [[applicant]] = await pool.query('SELECT * FROM employees WHERE id = ?', [applicantId]);
    if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });

    // Generate Employee Code: [OI][First2_Name][Last2_Name][Year][Serial]
    const nameParts = applicant.name.trim().split(' ');
    const firstTwo = nameParts[0].substring(0, 2).toUpperCase();
    const lastTwo = (nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0]).substring(0, 2).toUpperCase();
    const year = new Date().getFullYear();

    const [approvedCount] = await pool.query("SELECT COUNT(*) as cnt FROM employees WHERE status = 'approved'");
    const serial = String(approvedCount[0].cnt + 1).padStart(4, '0');
    const generatedEmployeeCode = `OI${firstTwo}${lastTwo}${year}${serial}`;

    await pool.query(
      "UPDATE employees SET employee_code = ?, status = 'approved', verified = 1 WHERE id = ?",
      [generatedEmployeeCode, applicantId]
    );

    res.json({ success: true, message: `Applicant approved! Issued Employee ID: ${generatedEmployeeCode}`, employeeCode: generatedEmployeeCode });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------------------------------------------------
// API Endpoint: HR Rejects Applicant
// ------------------------------------------------------------
app.post('/api/reject-applicant', async (req, res) => {
  const { applicantId } = req.body;
  try {
    await pool.query("UPDATE employees SET status = 'rejected' WHERE id = ?", [applicantId]);
    res.json({ success: true, message: 'Applicant request rejected.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dayflow HRMS MySQL Express Server running on port ${PORT}`);
});
