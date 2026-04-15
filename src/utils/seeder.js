require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Department.deleteMany(),
    Employee.deleteMany(),
    Payroll.deleteMany(),
  ]);

  console.log('Seeding departments...');
  const departments = await Department.insertMany([
    { name: 'Engineering', description: 'Software development and infrastructure' },
    { name: 'Human Resources', description: 'Recruitment, onboarding, and employee relations' },
    { name: 'Finance', description: 'Accounting, budgeting, and financial planning' },
    { name: 'Marketing', description: 'Brand, campaigns, and growth' },
  ]);

  console.log('Seeding employees...');
  const employees = await Employee.insertMany([
    { name: 'Alice Johnson', email: 'alice@hrms.com', department: departments[0]._id, position: 'Senior Engineer', phone: '+1-555-0101' },
    { name: 'Bob Martinez', email: 'bob@hrms.com', department: departments[1]._id, position: 'HR Manager', phone: '+1-555-0102' },
    { name: 'Carol White', email: 'carol@hrms.com', department: departments[2]._id, position: 'Finance Analyst', phone: '+1-555-0103' },
    { name: 'David Kim', email: 'david@hrms.com', department: departments[0]._id, position: 'Frontend Developer', phone: '+1-555-0104' },
  ]);

  console.log('Seeding users...');
  await User.insertMany([
    { email: 'admin@hrms.com', password: 'Admin@1234', role: 'admin' },
    { email: 'hr@hrms.com', password: 'Hr@1234', role: 'hr', employee: employees[1]._id },
    { email: 'employee@hrms.com', password: 'Emp@1234', role: 'employee', employee: employees[0]._id },
  ]);

  console.log('Seeding payrolls...');
  await Payroll.insertMany([
    { employee: employees[0]._id, basicSalary: 8000, bonus: 500, allowances: { housing: 500, transport: 200, medical: 100 }, deductions: { tax: 800, insurance: 200 } },
    { employee: employees[1]._id, basicSalary: 6000, bonus: 300, allowances: { housing: 400, transport: 150, medical: 100 }, deductions: { tax: 600, insurance: 150 } },
    { employee: employees[2]._id, basicSalary: 5500, bonus: 200, allowances: { housing: 300, transport: 100, medical: 100 }, deductions: { tax: 550, insurance: 130 } },
    { employee: employees[3]._id, basicSalary: 6500, bonus: 400, allowances: { housing: 450, transport: 180, medical: 100 }, deductions: { tax: 650, insurance: 170 } },
  ]);

  console.log('\n✅ Seed complete!');
  console.log('─────────────────────────────────────');
  console.log('Admin   → admin@hrms.com   / Admin@1234');
  console.log('HR      → hr@hrms.com      / Hr@1234');
  console.log('Employee→ employee@hrms.com/ Emp@1234');
  console.log('─────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
