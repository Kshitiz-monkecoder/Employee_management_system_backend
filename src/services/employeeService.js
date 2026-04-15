const employeeRepository = require('../repositories/employeeRepository');
const departmentRepository = require('../repositories/departmentRepository');
const AppError = require('../utils/AppError');

class EmployeeService {
  async getAllEmployees(queryString) {
    return employeeRepository.findAll(queryString);
  }

  async getEmployee(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) throw new AppError('Employee not found.', 404);
    return employee;
  }

  async createEmployee(data) {
    const department = await departmentRepository.findById(data.department);
    if (!department) throw new AppError('Department not found.', 404);

    const existing = await employeeRepository.findByEmail(data.email);
    if (existing) throw new AppError('An employee with this email already exists.', 409);

    return employeeRepository.create(data);
  }

  async updateEmployee(id, data) {
    if (data.department) {
      const department = await departmentRepository.findById(data.department);
      if (!department) throw new AppError('Department not found.', 404);
    }

    const employee = await employeeRepository.update(id, data);
    if (!employee) throw new AppError('Employee not found.', 404);
    return employee;
  }

  async deleteEmployee(id) {
    const employee = await employeeRepository.delete(id);
    if (!employee) throw new AppError('Employee not found.', 404);
    return employee;
  }

  async getStats() {
    const byDepartment = await employeeRepository.countByDepartment();
    return { byDepartment };
  }
}

module.exports = new EmployeeService();
