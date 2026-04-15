const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const auditLogger = require('../middlewares/auditLogger');

router.use(protect);

router.get('/stats', authorize('admin'), payrollController.getPayrollStats);
router.get('/employee/:employeeId', auditLogger('Payroll'), payrollController.getEmployeePayroll);

router
  .route('/')
  .get(authorize('admin', 'hr'), auditLogger('Payroll'), payrollController.getAllPayrolls)
  .post(
    authorize('admin'),
    validate(schemas.createPayroll),
    auditLogger('Payroll'),
    payrollController.createPayroll
  );

router
  .route('/:id')
  .get(authorize('admin', 'hr'), auditLogger('Payroll'), payrollController.getPayroll)
  .put(authorize('admin'), auditLogger('Payroll'), payrollController.updatePayroll)
  .delete(authorize('admin'), auditLogger('Payroll'), payrollController.deletePayroll);

router.post('/:id/process', authorize('admin'), auditLogger('Payroll'), payrollController.processPayment);

module.exports = router;
