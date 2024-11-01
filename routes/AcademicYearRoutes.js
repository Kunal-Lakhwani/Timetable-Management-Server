const express = require('express');
const router = express.Router();
const controller = require('../controllers/AcademicYearController');

router.post('/Add', controller.addAcademicYear);
router.get('/Active', controller.getActiveYears);
router.get('/Inactive', controller.getInactiveYears);
router.get('/Active/:id', controller.getSpecifiedYear);
router.put('/SetInactive/:id', controller.setInactive);
router.put('/Update/:id', controller.updateAcademicYear);
router.delete('/Delete/:id', controller.deleteAcademicYear);

module.exports = router;
