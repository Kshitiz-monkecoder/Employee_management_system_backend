const employeeService = require('../services/employeeService');
const catchAsync = require('../utils/catchAsync');

exports.getAllEmployees = catchAsync(async (req, res) => {
  const { employees, total, page, limit } = await employeeService.getAllEmployees(req.query);

  res.status(200).json({
    status: 'success',
    results: employees.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { employees },
  });
});

exports.getEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.getEmployee(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { employee },
  });
});

exports.createEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);

  res.status(201).json({
    status: 'success',
    data: { employee },
  });
});

exports.updateEmployee = catchAsync(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { employee },
  });
});

exports.deleteEmployee = catchAsync(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getStats = catchAsync(async (req, res) => {
  const stats = await employeeService.getStats();

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});
