const attendanceService = require('../services/attendanceService');
const catchAsync = require('../utils/catchAsync');

exports.getAllAttendance = catchAsync(async (req, res) => {
  const { records, total, page, limit } = await attendanceService.getAllAttendance(req.query);

  res.status(200).json({
    status: 'success',
    results: records.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { records },
  });
});

exports.getEmployeeAttendance = catchAsync(async (req, res) => {
  const { records, total, page, limit } = await attendanceService.getEmployeeAttendance(
    req.params.employeeId,
    req.query
  );

  res.status(200).json({
    status: 'success',
    results: records.length,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    data: { records },
  });
});

exports.markAttendance = catchAsync(async (req, res) => {
  const record = await attendanceService.markAttendance(req.body, req.user._id);

  res.status(201).json({
    status: 'success',
    data: { record },
  });
});

exports.updateAttendance = catchAsync(async (req, res) => {
  const record = await attendanceService.updateAttendance(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { record },
  });
});

exports.deleteAttendance = catchAsync(async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMonthlySummary = catchAsync(async (req, res) => {
  const { employeeId } = req.params;
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ status: 'fail', message: 'Please provide month and year as query params.' });
  }

  const summary = await attendanceService.getMonthlySummary(employeeId, month, year);

  res.status(200).json({
    status: 'success',
    data: { summary },
  });
});
