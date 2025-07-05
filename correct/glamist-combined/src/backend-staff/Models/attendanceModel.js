const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  EmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employeeModel',
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
});

module.exports = mongoose.model('attendanceModel', attendanceSchema);