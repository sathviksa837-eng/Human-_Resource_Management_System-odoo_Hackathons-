# Dayflow - Human Resource Management System (HRMS)

Dayflow is a comprehensive Human Resource Management System designed to streamline HR operations, attendance tracking, and employee management. It features a robust dual-portal architecture separating the workspace into an Employee Portal and an Admin/HR Command Center.

## 🚀 Features

### Dual-Portal Architecture
*   **Employee Portal:** A dedicated workspace for employees to check in/out, view attendance history, apply for time off, and check payslips.
*   **Admin/HR Command Center:** A powerful administrative dashboard for HR managers to approve applicants, manage the employee directory, review leave requests, and track company-wide attendance and payroll.

### Core Modules
*   **Live Attendance Tracking:** Real-time shift punch-in and punch-out with automatic exact work hour calculations.
*   **Leave Management:** Employees can request paid, sick, or casual leave. HR can review and approve or reject these requests.
*   **Payroll Processing:** Automated pro-rated salary calculations based on base salary, allowances, deductions, and attendance history.
*   **Candidate Onboarding:** Candidates can sign up and choose their respective HR managers. HR managers can review pending applicants, accept them, and instantly issue auto-generated Employee IDs.
*   **Interactive Dashboards:** Visual metrics showing workforce statistics, recent activity, and quick summaries.

### UI / UX
*   **Theming:** Built-in Light and Dark mode toggles.
*   **Responsive Design:** Fully responsive interface built with vanilla HTML/CSS/JS.

## 🛠️ Tech Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL (using `mysql2` package)

## 📦 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) installed
*   [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally

### Installation

1. **Install Dependencies:**
   Navigate to the project root and install the required Node.js packages:
   ```bash
   npm install express cors mysql2
   ```

2. **Database Setup:**
   * Open your MySQL client.
   * Run the provided `schema.sql` script to create the `dayflow_hrms` database, tables, and insert seed data (HR Managers and Employees).

3. **Start the Backend API Server:**
   ```bash
   node server.js
   ```
   *The server will run on `http://localhost:3000`.*

4. **Run the Frontend Application:**
   Serve the project directory using a local web server, for example with `npx serve`:
   ```bash
   npx serve . -p 8080
   ```
   *The web application will be accessible at `http://localhost:8080`.*

## 🔐 Default Seed Data (Test Accounts)

You can use the following accounts from the seeded database to log in and test the system:

**HR Manager (Admin)**
*   **Email:** `hr.eleanor@dayflow.com`
*   **Password:** `password123`

**Regular Employee**
*   **Email:** `sarah@dayflow.com`
*   **Password:** `password123`
