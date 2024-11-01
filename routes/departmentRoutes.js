const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentController')

router.post('/', controller.createDepartment);
router.get('/', controller.getAllDepartments);
router.get('/GetDepartment/:id', controller.getDepartmentById);
router.put('/UpdateDepartment/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

module.exports = router;