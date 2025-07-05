// backend/Controlers/attendanceControl.js
const Attendance = require('../Models/attendanceModel');

const markAttendance = async (req, res, next) => {
  const { EmployeeId, attendanceDate, Status } = req.body; // Renamed Date to attendanceDate
  try {
    const normalizedDate = new Date(attendanceDate); // Use global Date constructor
    normalizedDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day
    console.log('Marking attendance:', { EmployeeId, Date: normalizedDate, Status });

    const attendance = await Attendance.findOneAndUpdate(
      { EmployeeId, Date: normalizedDate },
      { Status },
      { upsert: true, new: true }
    );
    return res.status(201).json({ attendance });
  } catch (err) {
    console.error('Error in markAttendance:', err.message, err.stack);
    return res.status(500).json({ message: 'Unable to mark attendance', error: err.message });
  }
};

const getAttendanceByDate = async (req, res, next) => {
  const { date } = req.params;
  try {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const attendance = await Attendance.find({ Date: normalizedDate })
      .populate('EmployeeId', 'EmployeeName');
    return res.status(200).json({ attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch attendance' });
  }
};

const getAttendanceReport = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  try {
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    console.log('Fetching report:', { start, end });
    const attendance = await Attendance.find({
      Date: { $gte: start, $lte: end },
    }).populate('EmployeeId', 'EmployeeName');
    return res.status(200).json({ attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to generate report' });
  }
};

exports.markAttendance = markAttendance;
exports.getAttendanceByDate = getAttendanceByDate;
exports.getAttendanceReport = getAttendanceReport;