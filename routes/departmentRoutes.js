// const express = require('express');
// const router = express.Router();
// const departmentController = require('../controllers/departmentController');

// router.post('/', departmentController.createDepartment);
// router.get('/', departmentController.getAllDepartments);
// router.get('/:id', departmentController.getDepartmentById);
// router.put('/:id', departmentController.updateDepartment);
// router.delete('/:id', departmentController.deleteDepartment);

// module.exports = router;


const express = require('express');
const router = express.Router();
const Department = require('../models/department');

// Create Department
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        
        const department = new Department(req.body);
        await department.save();
        res.status(201).send(department);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get all Departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).send(departments);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get Department by ID
router.get('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).send();
        }
        res.send(department);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Department
router.patch('/departments/:id', async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!department) {
            return res.status(404).send();
        }
        res.send(department);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Department
router.delete('/:id', async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).send();
        }
        res.send(department);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;