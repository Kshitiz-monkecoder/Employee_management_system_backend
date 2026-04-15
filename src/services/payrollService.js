const payrollRepository = require('../repositories/payrollRepository');
const employeeRepository = require('../repositories/employeeRepository');
const AppError = require('../utils/AppError');

class PayrollService {
  async getAllPayrolls(queryString) {
    return payrollRepository.findAll(queryString);
  }

  async getPayroll(id) {
    const payroll = await payrollRepository.findById(id);
    if (!payroll) throw new AppError('Payroll record not found.', 404);
    return payroll;
  }

  async getEmployeePayroll(employeeId) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw new AppError('Employee not found.', 404);

    const payroll = await payrollRepository.findByEmployee(employeeId);
    if (!payroll) throw new AppError('No payroll record found for this employee.', 404);
    return payroll;
  }

  async createPayroll(data) {
    const employee = await employeeRepository.findById(data.employee);
    if (!employee) throw new AppError('Employee not found.', 404);

    const existing = await payrollRepository.findByEmployee(data.employee);
    if (existing) throw new AppError('A payroll record already exists for this employee.', 409);

    return payrollRepository.create(data);
  }

  async updatePayroll(id, data) {
    const payroll = await payrollRepository.update(id, data);
    if (!payroll) throw new AppError('Payroll record not found.', 404);
    return payroll;
  }

  async deletePayroll(id) {
    const payroll = await payrollRepository.delete(id);
    if (!payroll) throw new AppError('Payroll record not found.', 404);
    return payroll;
  }

  async processMonthlyPayment(id) {
    const payroll = await payrollRepository.findById(id);
    if (!payroll) throw new AppError('Payroll record not found.', 404);

    const now = new Date();
    const payment = {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: payroll.netSalary,
      paidOn: now,
      status: 'paid',
    };

    return payrollRepository.addPaymentRecord(id, payment);
  }

  async getPayrollStats() {
    const stats = await payrollRepository.getTotalPayrollCost();
    return stats[0] || { totalBasic: 0, totalBonus: 0, totalNet: 0, count: 0 };
  }
}

module.exports = new PayrollService();
