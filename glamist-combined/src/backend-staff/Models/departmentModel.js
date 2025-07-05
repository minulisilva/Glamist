// backend/Models/departmentModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  DepartmentName: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  EmployeeCount: {
    type: Number,
    default: 0, // Tracks total employees
  },
});

module.exports = mongoose.model('departmentModel', departmentSchema);