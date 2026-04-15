const Attendance = require('../models/Attendance');
const APIFeatures = require('../utils/apiFeatures');

class AttendanceRepository {
  async findAll(queryString) {
    const features = new APIFeatures(
      Attendance.find().populate('employee', 'name email employeeId').populate('markedBy', 'email'),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const [records, total] = await Promise.all([
      features.query,
      Attendance.countDocuments(),
    ]);

    return { records, total, ...features.pagination };
  }

  async findByEmployee(employeeId, queryString) {
    const features = new APIFeatures(
      Attendance.find({ employee: employeeId }).populate('employee', 'name employeeId'),
      queryString
    )
      .filter()
      .sort()
      .paginate();

    const [records, total] = await Promise.all([
      features.query,
      Attendance.countDocuments({ employee: employeeId }),
    ]);

    return { records, total, ...features.pagination };
  }

  async findByEmployeeAndDate(employeeId, date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return Attendance.findOne({ employee: employeeId, date: { $gte: start, $lte: end } });
  }

  async create(data) {
    return Attendance.create(data);
  }

  async update(id, data) {
    return Attendance.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('employee', 'name employeeId');
  }

  async delete(id) {
    return Attendance.findByIdAndDelete(id);
  }

  async getMonthlySummary(employeeId, month, year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Attendance.aggregate([
      { $match: { employee: employeeId, date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursWorked' },
        },
      },
    ]);
  }
}

module.exports = new AttendanceRepository();
