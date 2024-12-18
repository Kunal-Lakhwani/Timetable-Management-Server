const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');

router.post('/', groupController.createGroup);
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.get('/GroupsInTimetable/:TimetableID', groupController.getGroupsInTimetable);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;
