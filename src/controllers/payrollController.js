const payrollService = require('../services/payrollService');
const catchAsync = require('../utils/catchAsync');

exports.getAllPayrolls = catchAsync(async (req, res) => {
  const { payrolls, total, page, limit } = await payrollService.getAllPayrolls(req.query);

  res.status(200).json({
    status: 'success',
    results: payrolls.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { payrolls },
  });
});

exports.getPayroll = catchAsync(async (req, res) => {
  const payroll = await payrollService.getPayroll(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { payroll },
  });
});

exports.getEmployeePayroll = catchAsync(async (req, res) => {
  const payroll = await payrollService.getEmployeePayroll(req.params.employeeId);

  res.status(200).json({
    status: 'success',
    data: { payroll },
  });
});

exports.createPayroll = catchAsync(async (req, res) => {
  const payroll = await payrollService.createPayroll(req.body);

  res.status(201).json({
    status: 'success',
    data: { payroll },
  });
});

exports.updatePayroll = catchAsync(async (req, res) => {
  const payroll = await payrollService.updatePayroll(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { payroll },
  });
});

exports.deletePayroll = catchAsync(async (req, res) => {
  await payrollService.deletePayroll(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.processPayment = catchAsync(async (req, res) => {
  const payroll = await payrollService.processMonthlyPayment(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Payment processed successfully.',
    data: { payroll },
  });
});

exports.getPayrollStats = catchAsync(async (req, res) => {
  const stats = await payrollService.getPayrollStats();

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});
