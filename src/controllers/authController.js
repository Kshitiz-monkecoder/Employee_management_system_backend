const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.register = catchAsync(async (req, res) => {
  const { token, user } = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});
