const departmentRepository = require('../repositories/departmentRepository');
const AppError = require('../utils/AppError');

class DepartmentService {
  async getAllDepartments(queryString) {
    return departmentRepository.findAll(queryString);
  }

  async getDepartment(id) {
    const department = await departmentRepository.findById(id);
    if (!department) throw new AppError('Department not found.', 404);
    return department;
  }

  async createDepartment(data) {
    const existing = await departmentRepository.findByName(data.name);
    if (existing) throw new AppError('A department with this name already exists.', 409);
    return departmentRepository.create(data);
  }

  async updateDepartment(id, data) {
    if (data.name) {
      const existing = await departmentRepository.findByName(data.name);
      if (existing && existing._id.toString() !== id) {
        throw new AppError('A department with this name already exists.', 409);
      }
    }
    const department = await departmentRepository.update(id, data);
    if (!department) throw new AppError('Department not found.', 404);
    return department;
  }

  async deleteDepartment(id) {
    const department = await departmentRepository.delete(id);
    if (!department) throw new AppError('Department not found.', 404);
    return department;
  }
}

module.exports = new DepartmentService();
