const attendanceRepository = require('../repositories/attendanceRepository');
const employeeRepository = require('../repositories/employeeRepository');
const AppError = require('../utils/AppError');

class AttendanceService {
  async getAllAttendance(queryString) {
    return attendanceRepository.findAll(queryString);
  }

  async getEmployeeAttendance(employeeId, queryString) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw new AppError('Employee not found.', 404);
    return attendanceRepository.findByEmployee(employeeId, queryString);
  }

  async markAttendance(data, markedBy) {
    const employee = await employeeRepository.findById(data.employee);
    if (!employee) throw new AppError('Employee not found.', 404);

    const existing = await attendanceRepository.findByEmployeeAndDate(data.employee, data.date);
    if (existing) throw new AppError('Attendance already marked for this employee on this date.', 409);

    return attendanceRepository.create({ ...data, markedBy });
  }

  async updateAttendance(id, data) {
    const record = await attendanceRepository.update(id, data);
    if (!record) throw new AppError('Attendance record not found.', 404);
    return record;
  }

  async deleteAttendance(id) {
    const record = await attendanceRepository.delete(id);
    if (!record) throw new AppError('Attendance record not found.', 404);
    return record;
  }

  async getMonthlySummary(employeeId, month, year) {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw new AppError('Employee not found.', 404);

    const summary = await attendanceRepository.getMonthlySummary(
      employee._id,
      parseInt(month),
      parseInt(year)
    );

    const result = { present: 0, absent: 0, late: 0, 'half-day': 0, leave: 0, totalHours: 0 };
    summary.forEach(({ _id, count, totalHours }) => {
      result[_id] = count;
      result.totalHours += totalHours || 0;
    });

    return { employee: { name: employee.name, employeeId: employee.employeeId }, month, year, summary: result };
  }
}

module.exports = new AttendanceService();
