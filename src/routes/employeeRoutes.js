const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const auditLogger = require('../middlewares/auditLogger');

router.use(protect);

router.get('/stats', authorize('admin', 'hr'), employeeController.getStats);

router
  .route('/')
  .get(auditLogger('Employee'), employeeController.getAllEmployees)
  .post(
    authorize('admin', 'hr'),
    validate(schemas.createEmployee),
    auditLogger('Employee'),
    employeeController.createEmployee
  );

router
  .route('/:id')
  .get(auditLogger('Employee'), employeeController.getEmployee)
  .put(
    authorize('admin', 'hr'),
    validate(schemas.updateEmployee),
    auditLogger('Employee'),
    employeeController.updateEmployee
  )
  .delete(authorize('admin'), auditLogger('Employee'), employeeController.deleteEmployee);

module.exports = router;
