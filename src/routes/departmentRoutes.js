const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const auditLogger = require('../middlewares/auditLogger');

router.use(protect);

router
  .route('/')
  .get(auditLogger('Department'), departmentController.getAllDepartments)
  .post(
    authorize('admin', 'hr'),
    validate(schemas.createDepartment),
    auditLogger('Department'),
    departmentController.createDepartment
  );

router
  .route('/:id')
  .get(auditLogger('Department'), departmentController.getDepartment)
  .put(
    authorize('admin', 'hr'),
    auditLogger('Department'),
    departmentController.updateDepartment
  )
  .delete(authorize('admin'), auditLogger('Department'), departmentController.deleteDepartment);

module.exports = router;
