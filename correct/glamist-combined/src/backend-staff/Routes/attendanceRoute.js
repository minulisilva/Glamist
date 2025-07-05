const express = require('express');
const router = express.Router();
const attendanceController = require('../Controlers/attendanceControl');

router.post('/', attendanceController.markAttendance);
router.get('/date/:date', attendanceController.getAttendanceByDate);
router.get('/report', attendanceController.getAttendanceReport);

module.exports = router;