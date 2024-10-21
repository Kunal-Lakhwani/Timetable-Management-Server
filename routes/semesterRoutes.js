const express = require('express');
const router = express.Router();
const Semester = require('../models/semester'); // Adjust the path as necessary

// POST endpoint to create a new semester
router.post('/', async (req, res) => {
    const { name, year, status } = req.body;
    try {
        const semester = new Semester({ name, year, status });
        await semester.save();
        res.status(201).send(semester);
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET endpoint to fetch all semesters
router.get('/', async (req, res) => {
    try {
        const semesters = await Semester.find();
        res.send(semesters);
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET endpoint to fetch a single semester by ID
router.get('/:id', async (req, res) => {
    try {
        const semester = await Semester.findById(req.params.id);
        if (!semester) {
            return res.status(404).send({ message: 'Semester not found' });
        }
        res.send(semester);
    } catch (err) {
        res.status(400).send(err);
    }
});

// PATCH endpoint to update a semester by ID
router.patch('/:id', async (req, res) => {
    try {
        const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  // Return the updated document
            runValidators: true,  // Ensure the update validates against the schema
        });
        if (!semester) {
            return res.status(404).send({ message: 'Semester not found' });
        }
        res.send(semester);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE endpoint to remove a semester by ID
router.delete('/:id', async (req, res) => {
    try {
        const semester = await Semester.findByIdAndDelete(req.params.id);
        if (!semester) {
            return res.status(404).send({ message: 'Semester not found' });
        }
        res.send({ message: 'Semester deleted successfully' });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
