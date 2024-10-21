const express = require('express');
const router = express.Router();
const labScheduleController = require('../controllers/labScheduleController');

router.post('/', labScheduleController.createLabSchedule);
router.get('/', labScheduleController.getAllLabSchedules);
router.get('/:id', labScheduleController.getLabScheduleById);
router.put('/:id', labScheduleController.updateLabSchedule);
router.delete('/:id', labScheduleController.deleteLabSchedule);

module.exports = router;
