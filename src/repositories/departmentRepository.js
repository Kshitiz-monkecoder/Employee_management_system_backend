const Department = require('../models/Department');
const APIFeatures = require('../utils/apiFeatures');

class DepartmentRepository {
  async findAll(queryString) {
    const features = new APIFeatures(Department.find().populate('manager', 'name email'), queryString)
      .filter()
      .search(['name', 'description'])
      .sort()
      .limitFields()
      .paginate();

    const [departments, total] = await Promise.all([
      features.query,
      Department.countDocuments(),
    ]);

    return { departments, total, ...features.pagination };
  }

  async findById(id) {
    return Department.findById(id).populate('manager', 'name email position');
  }

  async findByName(name) {
    return Department.findOne({ name });
  }

  async create(data) {
    return Department.create(data);
  }

  async update(id, data) {
    return Department.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('manager', 'name email');
  }

  async delete(id) {
    return Department.findByIdAndDelete(id);
  }
}

module.exports = new DepartmentRepository();
