const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

router.post('/', labController.createLab);
router.get('/', labController.getAllLabs);
router.get('/:id', labController.getLabById);
router.put('/:id', labController.updateLab);
router.delete('/:id', labController.deleteLab);

module.exports = router;
