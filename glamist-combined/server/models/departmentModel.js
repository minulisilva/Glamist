import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  DepartmentName: { type: String, required: true },
  Description: { type: String, required: true },
  EmployeeCount: { type: Number, default: 0 },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
});

export default mongoose.model('Department', departmentSchema);