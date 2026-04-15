const Employee = require('../models/Employee');
const APIFeatures = require('../utils/apiFeatures');

class EmployeeRepository {
  async findAll(queryString) {
    const features = new APIFeatures(Employee.find().populate('department', 'name'), queryString)
      .filter()
      .search(['name', 'email', 'position', 'employeeId'])
      .sort()
      .limitFields()
      .paginate();

    const [employees, total] = await Promise.all([
      features.query,
      Employee.countDocuments(),
    ]);

    return { employees, total, ...features.pagination };
  }

  async findById(id) {
    return Employee.findById(id).populate('department', 'name description');
  }

  async findByEmail(email) {
    return Employee.findOne({ email });
  }

  async create(data) {
    return Employee.create(data);
  }

  async update(id, data) {
    return Employee.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('department', 'name');
  }

  async delete(id) {
    return Employee.findByIdAndDelete(id);
  }

  async countByDepartment() {
    return Employee.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
      { $unwind: '$department' },
      { $project: { departmentName: '$department.name', count: 1 } },
    ]);
  }
}

module.exports = new EmployeeRepository();
