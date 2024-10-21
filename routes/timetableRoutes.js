const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.post('/NewTimetable', timetableController.createTimetable);
router.get('/', timetableController.getAllTimetables);
router.get('/detailedInfo/:id', timetableController.getDetailedTimetableInfo);
router.get('/:id', timetableController.getTimetableById);
router.put('/UpdateInfo/:id', timetableController.updateTimetableInfo);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;
