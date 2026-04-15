const Payroll = require('../models/Payroll');
const APIFeatures = require('../utils/apiFeatures');

class PayrollRepository {
  async findAll(queryString) {
    const features = new APIFeatures(
      Payroll.find().populate('employee', 'name email employeeId position'),
      queryString
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const [payrolls, total] = await Promise.all([
      features.query,
      Payroll.countDocuments(),
    ]);

    return { payrolls, total, ...features.pagination };
  }

  async findByEmployee(employeeId) {
    return Payroll.findOne({ employee: employeeId }).populate('employee', 'name email employeeId position department');
  }

  async findById(id) {
    return Payroll.findById(id).populate('employee', 'name email employeeId position');
  }

  async create(data) {
    return Payroll.create(data);
  }

  async update(id, data) {
    return Payroll.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('employee', 'name email employeeId');
  }

  async delete(id) {
    return Payroll.findByIdAndDelete(id);
  }

  async addPaymentRecord(id, payment) {
    return Payroll.findByIdAndUpdate(
      id,
      { $push: { paymentHistory: payment } },
      { new: true }
    );
  }

  async getTotalPayrollCost() {
    return Payroll.aggregate([
      {
        $group: {
          _id: null,
          totalBasic: { $sum: '$basicSalary' },
          totalBonus: { $sum: '$bonus' },
          totalNet: { $sum: '$netSalary' },
          count: { $sum: 1 },
        },
      },
    ]);
  }
}

module.exports = new PayrollRepository();
