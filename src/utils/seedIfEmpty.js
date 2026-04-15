// seedFullData.js
const User = require('../models/User');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');

const seedIfEmpty = async () => {
  const exists = await Employee.countDocuments();
  

  console.log('🌱 Seeding full mock data...');

  // 1. Departments
  const deptNames = ['Engineering','Product','Design','Analytics','HR','Finance','Marketing'];
  const departments = await Department.insertMany(
    deptNames.map(name => ({ name }))
  );

  const deptMap = {};
  departments.forEach(d => deptMap[d.name] = d._id);

  // 2. Employees
  const employeesData = [
    { name:'Arjun Mehta', role:'Senior Engineer', department:'Engineering', salary:125000, email:'arjun@nexcorp.io', phone:'+91 98765 43210' },
    { name:'Sneha Patel', role:'Product Manager', department:'Product', salary:118000, email:'sneha@nexcorp.io', phone:'+91 87654 32109' },
    { name:'Rahul Verma', role:'UI/UX Designer', department:'Design', salary:95000, email:'rahul@nexcorp.io', phone:'+91 76543 21098' },
    { name:'Ananya Singh', role:'Data Analyst', department:'Analytics', salary:105000, email:'ananya@nexcorp.io', phone:'+91 65432 10987' },
    { name:'Vikram Nair', role:'Backend Engineer', department:'Engineering', salary:115000, email:'vikram@nexcorp.io', phone:'+91 54321 09876' },
    { name:'Deepika Rao', role:'HR Manager', department:'HR', salary:98000, email:'deepika@nexcorp.io', phone:'+91 43210 98765' },
    { name:'Karthik Iyer', role:'DevOps Engineer', department:'Engineering', salary:112000, email:'karthik@nexcorp.io', phone:'+91 32109 87654' },
    { name:'Meera Krishnan', role:'QA Engineer', department:'Engineering', salary:88000, email:'meera@nexcorp.io', phone:'+91 21098 76543' },
    { name:'Rohan Gupta', role:'Marketing Lead', department:'Marketing', salary:102000, email:'rohan@nexcorp.io', phone:'+91 10987 65432' },
    { name:'Lakshmi Devi', role:'Finance Analyst', department:'Finance', salary:108000, email:'lakshmi@nexcorp.io', phone:'+91 09876 54321' },
    { name:'Saurabh Joshi', role:'Frontend Engineer', department:'Engineering', salary:98000, email:'saurabh@nexcorp.io', phone:'+91 98876 54321' },
    { name:'Preethi Nair', role:'Content Strategist', department:'Marketing', salary:85000, email:'preethi@nexcorp.io', phone:'+91 87765 43210' },
  ];

  const employees = await Employee.insertMany(
    employeesData.map(e => ({
      name: e.name,
      email: e.email,
      department: deptMap[e.department],
      position: e.role,
      phone: e.phone,
    }))
  );

  // 3. Users
  await User.insertMany([
    { email: 'admin@hrms.com', password: 'Admin@1234', role: 'admin' },
    { email: 'hr@hrms.com', password: 'Hr@1234', role: 'hr', employee: employees[5]._id },
    { email: 'employee@hrms.com', password: 'Emp@1234', role: 'employee', employee: employees[0]._id },
  ]);

  // 4. Payroll
  await Payroll.insertMany(
    employees.map((emp, i) => ({
      employee: emp._id,
      basicSalary: employeesData[i].salary,
      bonus: 300,
      allowances: { housing: 300, transport: 150, medical: 100 },
      deductions: { tax: 500, insurance: 150 },
    }))
  );

  console.log('✅ Full data seeded');
};

module.exports = seedIfEmpty;