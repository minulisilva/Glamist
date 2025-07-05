// backend/Controlers/employeeControl.js
const Employee = require('../Models/employeeModel');
const Department = require('../Models/departmentModel');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayodhyamitho@gmail.com',
    pass: 'zjfq rrdu tdsw seie',
  },
});

// Helper function to send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Salon Manager" <ayodhyamitho@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error('Email Error:', err.message);
    throw err;
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const getAllEmployees = async (req, res, next) => {
  try {
    const { name } = req.query; // Get name from query params
    let employees;
    if (name) {
      // Case-insensitive search by name
      employees = await Employee.find({
        EmployeeName: { $regex: new RegExp(name, 'i') },
      }).populate('DepartmentId', 'DepartmentName');
    } else {
      // No name provided, return all employees
      employees = await Employee.find().populate('DepartmentId', 'DepartmentName');
    }
    return res.status(200).json({ employees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

const addEmployee = async (req, res, next) => {
  const { EmployeeName, Role, Age, Address, Phone, HireDate, DepartmentId, Email } = req.body;
  const ProfilePicture = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const employee = new Employee({
      EmployeeName,
      Role,
      Age,
      Address,
      Phone,
      HireDate,
      DepartmentId,
      ProfilePicture,
      Email,
    });
    const savedEmployee = await employee.save();
    await Department.findByIdAndUpdate(DepartmentId, { $inc: { EmployeeCount: 1 } }, { new: true });
    const department = await Department.findById(DepartmentId);
    const deptName = department ? department.DepartmentName : 'Unknown';
    await sendEmail(
      Email,
      'Welcome to the Salon!',
      `Hi ${EmployeeName},\nYou’ve been added to our team!\nDetails:\n- Role: ${Role}\n- Age: ${Age}\n- Phone: ${Phone}\n- Address: ${Address}\n- Hire Date: ${new Date(HireDate).toLocaleDateString()}\n- Department: ${deptName}`
    );
    return res.status(201).json({ employee: savedEmployee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to add employee', error: err.message });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findById(id).populate('DepartmentId', 'DepartmentName');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json({ employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateEmployee = async (req, res, next) => {
  const id = req.params.id;
  const { EmployeeName, Role, Age, Address, Phone, HireDate, DepartmentId, Email } = req.body;
  const ProfilePicture = req.file ? `/uploads/${req.file.filename}` : undefined;
  try {
    const oldEmployee = await Employee.findById(id);
    if (!oldEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const updateData = {
      EmployeeName,
      Role,
      Age,
      Address,
      Phone,
      HireDate,
      DepartmentId,
      Email,
    };
    if (ProfilePicture) updateData.ProfilePicture = ProfilePicture;
    const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    if (oldEmployee.DepartmentId.toString() !== DepartmentId) {
      await Department.findByIdAndUpdate(oldEmployee.DepartmentId, { $inc: { EmployeeCount: -1 } }, { new: true });
      await Department.findByIdAndUpdate(DepartmentId, { $inc: { EmployeeCount: 1 } }, { new: true });
    }
    const department = await Department.findById(DepartmentId);
    const deptName = department ? department.DepartmentName : 'Unknown';
    await sendEmail(
      Email,
      'Profile Updated',
      `Hi ${EmployeeName},\nYour profile has been updated!\nDetails:\n- Role: ${Role}\n- Age: ${Age}\n- Phone: ${Phone}\n- Address: ${Address}\n- Hire Date: ${new Date(HireDate).toLocaleDateString()}\n- Department: ${deptName}`
    );
    return res.status(200).json({ employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to update employee', error: err.message });
  }
};

const deleteEmployee = async (req, res, next) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await Department.findByIdAndUpdate(employee.DepartmentId, { $inc: { EmployeeCount: -1 } }, { new: true });
    await sendEmail(
      employee.Email,
      'Account Removed',
      `Hi ${employee.EmployeeName},\nYour account has been removed from the salon system.`
    );
    return res.status(200).json({ employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to delete employee' });
  }
};

const sendNotice = async (req, res) => {
  const { message } = req.body;
  try {
    const employees = await Employee.find({}, 'Email EmployeeName');
    const promises = employees.map((emp) =>
      sendEmail(emp.Email, 'Salon Notice', `Hi ${emp.EmployeeName},\n${message}`)
    );
    await Promise.all(promises);
    return res.status(200).json({ message: 'Notice sent successfully to all employees' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send notice', error: err.message });
  }
};

exports.upload = upload;
exports.getAllEmployees = getAllEmployees;
exports.addEmployee = addEmployee;
exports.getById = getById;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
exports.sendNotice = sendNotice;