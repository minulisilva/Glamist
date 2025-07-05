// backend/Models/employeeModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  EmployeeName: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  HireDate: {
    type: Date,
    default: Date.now,
  },
  DepartmentId: {
    type: Schema.Types.ObjectId,
    ref: 'departmentModel',
    required: true,
  },
  ProfilePicture: {
    type: String,
    default: '',
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
});

module.exports = mongoose.model('employeeModel', employeeSchema);