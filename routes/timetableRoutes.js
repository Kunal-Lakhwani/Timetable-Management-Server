const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.post('/NewTimetable', timetableController.createTimetable);
router.get('/detailedInfo/:id', timetableController.getDetailedTimetableInfo);
router.get('/TimetablesOfYear/:YearID', timetableController.getTimetablesByYearId)
router.get('/:id', timetableController.getTimetableById);
router.put('/ResetOccupiedSlots', timetableController.ResetOccupiedSlots);
router.put('/UpdateInfo/:id', timetableController.updateTimetableInfo);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;
