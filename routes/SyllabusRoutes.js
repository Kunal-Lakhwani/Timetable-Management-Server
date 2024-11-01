const express = require('express');
const router = express.Router();
const controller = require('../controllers/SyllabusController');

// POST endpoint to create a new Syllabus
router.post('/', controller.createSyllabus);

// GET endpoint to fetch all Syllabuses
router.get('/', controller.getSyllabusInfo);

router.get('/GetByID/:SyllabusID', controller.getSyllabusByID)

// GET endpoint to fetch a single semester's info by ID and semester
router.get('/SemesterInfo/:SyllabusID/:semester', controller.getSemesterSubjects);

// // PUT endpoint to update a Syllabus by ID
// router.put('/:id', );

// // DELETE endpoint to remove a Syllabus by ID
// router.delete('/:id',);

module.exports = router;
