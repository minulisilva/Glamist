import { Router } from 'express';
const router = Router();
import { markAttendance, getAttendanceByDate, getAttendanceReport } from '../controllers/attendanceControl.js';

router.post('/', markAttendance);
router.get('/date/:date', getAttendanceByDate);
router.get('/report', getAttendanceReport);

export default router;