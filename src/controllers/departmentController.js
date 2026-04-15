const departmentService = require('../services/departmentService');
const catchAsync = require('../utils/catchAsync');

exports.getAllDepartments = catchAsync(async (req, res) => {
  const { departments, total, page, limit } = await departmentService.getAllDepartments(req.query);

  res.status(200).json({
    status: 'success',
    results: departments.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { departments },
  });
});

exports.getDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.getDepartment(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { department },
  });
});

exports.createDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);

  res.status(201).json({
    status: 'success',
    data: { department },
  });
});

exports.updateDepartment = catchAsync(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { department },
  });
});

exports.deleteDepartment = catchAsync(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
