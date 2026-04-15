const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const auditLogger = require('../middlewares/auditLogger');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'hr'), auditLogger('Attendance'), attendanceController.getAllAttendance)
  .post(
    authorize('admin', 'hr'),
    validate(schemas.markAttendance),
    auditLogger('Attendance'),
    attendanceController.markAttendance
  );

router
  .route('/:id')
  .put(authorize('admin', 'hr'), auditLogger('Attendance'), attendanceController.updateAttendance)
  .delete(authorize('admin'), auditLogger('Attendance'), attendanceController.deleteAttendance);

router.get('/employee/:employeeId', auditLogger('Attendance'), attendanceController.getEmployeeAttendance);
router.get('/employee/:employeeId/summary', attendanceController.getMonthlySummary);

module.exports = router;
