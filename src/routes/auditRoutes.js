const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middlewares/auth');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

router.use(protect);

router.get(
  '/',
  authorize('admin'),
  catchAsync(async (req, res) => {
    const features = new APIFeatures(
      AuditLog.find().populate('user', 'email role'),
      req.query
    )
      .filter()
      .sort()
      .paginate();

    const [logs, total] = await Promise.all([features.query, AuditLog.countDocuments()]);
    const { page, limit } = features.pagination;

    res.status(200).json({
      status: 'success',
      results: logs.length,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      data: { logs },
    });
  })
);

router.get(
  '/user/:userId',
  authorize('admin'),
  catchAsync(async (req, res) => {
    const logs = await AuditLog.find({ user: req.params.userId })
      .sort('-createdAt')
      .limit(50)
      .populate('user', 'email role');

    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: { logs },
    });
  })
);

module.exports = router;
