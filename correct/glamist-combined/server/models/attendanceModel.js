import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const attendanceSchema = new Schema({
  EmployeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employeeModel',
    required: true,
  },
  attendanceDate: { // Changed from 'Date' to 'attendanceDate' to match controller and frontend
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true,
  },
}, {
  timestamps: true, // Optional: Adds createdAt and updatedAt fields
});

// Add a unique index on EmployeeId and attendanceDate to prevent duplicate entries
attendanceSchema.index({ EmployeeId: 1, attendanceDate: 1 }, { unique: true });

export default model('attendanceModel', attendanceSchema);