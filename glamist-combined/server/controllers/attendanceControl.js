import employeeModel from '../models/employeeModel.js';
     import attendanceModel from '../models/attendanceModel.js';

     const markAttendance = async (req, res) => {
       const { EmployeeId, attendanceDate, Status } = req.body;
       try {
         const normalizedDate = new Date(attendanceDate);
         normalizedDate.setUTCHours(0, 0, 0, 0);
         console.log('Marking attendance:', { EmployeeId, Date: normalizedDate, Status });

         // Validate EmployeeId exists
         const employee = await employeeModel.findById(EmployeeId);
         if (!employee) {
           return res.status(400).json({ message: 'Invalid EmployeeId' });
         }

         const attendance = await attendanceModel.findOneAndUpdate(
           { EmployeeId, attendanceDate: normalizedDate },
           { Status },
           { upsert: true, new: true }
         );
         return res.status(201).json({ attendance });
       } catch (err) {
         console.error('Error in markAttendance:', err.message, err.stack);
         return res.status(500).json({ message: 'Unable to mark attendance', error: err.message });
       }
     };

     const getAttendanceByDate = async (req, res) => {
       const { date } = req.params;
       try {
         const normalizedDate = new Date(date);
         normalizedDate.setUTCHours(0, 0, 0, 0);
         const attendance = await attendanceModel
           .find({ attendanceDate: normalizedDate })
           .populate('EmployeeId', 'EmployeeName _id');
         const validAttendance = attendance.filter(a => a.EmployeeId);
         return res.status(200).json({ attendance: validAttendance });
       } catch (err) {
         console.error(err);
         return res.status(500).json({ message: 'Failed to fetch attendance' });
       }
     };

     const getAttendanceReport = async (req, res) => {
       const { startDate, endDate } = req.query;
       try {
         const start = new Date(startDate);
         start.setUTCHours(0, 0, 0, 0);
         const end = new Date(endDate);
         end.setUTCHours(23, 59, 59, 999);
         console.log('Fetching report:', { start, end });
         const attendance = await attendanceModel
           .find({
             attendanceDate: { $gte: start, $lte: end },
           })
           .populate('EmployeeId', 'EmployeeName');
         return res.status(200).json({ attendance });
       } catch (err) {
         console.error(err);
         return res.status(500).json({ message: 'Failed to generate report' });
       }
     };

     export { markAttendance, getAttendanceByDate, getAttendanceReport };