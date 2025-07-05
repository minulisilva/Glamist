import employeeModel from '../models/employeeModel.js';
import departmentModel from '../models/departmentModel.js';
import multer from 'multer';
import path from 'path';
import transporter from '../config/nodemailer.js';
import fs from 'fs';

// Ensure Uploads directory exists
const uploadDir = 'Uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created Uploads/ directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Helper function to send email with HTML support
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: '"Salon Manager" <dulminidilhara2001@8967304.brevosend.com>', // Replace with your verified sender email
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (err) {
    console.error('Email Error:', { to, subject, error: err.message, stack: err.stack });
    return false;
  }
};

const getAllEmployees = async (req, res) => {
  try {
    console.log('Fetching all employees with query:', req.query);
    const { name } = req.query;
    let employees;
    if (name) {
      employees = await employeeModel.find({
        EmployeeName: { $regex: new RegExp(name, 'i') },
      }).populate('DepartmentId', 'DepartmentName');
    } else {
      employees = await employeeModel.find().populate('DepartmentId', 'DepartmentName');
    }
    console.log('Employees fetched:', employees.length);
    return res.status(200).json({ employees });
  } catch (err) {
    console.error('Error in getAllEmployees:', { error: err.message, stack: err.stack });
    return res.status(500).json({ message: 'Failed to fetch employees', error: err.message });
  }
};

const addEmployee = async (req, res) => {
  const { EmployeeName, Role, Age, Address, Phone, HireDate, DepartmentId, Email } = req.body;
  const ProfilePicture = req.file ? `/Uploads/${req.file.filename}` : '';
  try {
    console.log('Adding employee with data:', { EmployeeName, Role, Age, Address, Phone, HireDate, DepartmentId, Email, ProfilePicture });

    // Validate required fields
    if (!EmployeeName || !Role || !Age || !Address || !Phone || !DepartmentId || !Email) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate Age as a number
    const ageNumber = Number(Age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      return res.status(400).json({ message: 'Age must be a positive number' });
    }

    // Validate Email format
    if (!/^\S+@\S+\.\S+$/.test(Email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate DepartmentId exists
    const department = await departmentModel.findById(DepartmentId);
    if (!department) {
      return res.status(400).json({ message: 'Invalid DepartmentId' });
    }

    const employee = new employeeModel({
      EmployeeName,
      Role,
      Age: ageNumber,
      Address,
      Phone,
      HireDate: HireDate ? new Date(HireDate) : new Date(), // Fallback to current date if not provided
      DepartmentId,
      ProfilePicture,
      Email,
    });

    const savedEmployee = await employee.save();
    await departmentModel.findByIdAndUpdate(DepartmentId, { $inc: { EmployeeCount: 1 } }, { new: true });
    const deptName = department.DepartmentName;

    const emailSent = await sendEmail(
      Email,
      'Welcome to the Salon!',
      `Hi ${EmployeeName},\nYou’ve been added to our team!\nDetails:\n- Role: ${Role}\n- Age: ${Age}\n- Phone: ${Phone}\n- Address: ${Address}\n- Hire Date: ${new Date(HireDate).toLocaleDateString()}\n- Department: ${deptName}`,
      `
        <h1>Welcome to the Salon, ${EmployeeName}!</h1>
        <p>You’ve been added to our team! Here are your details:</p>
        <ul>
          <li><strong>Role:</strong> ${Role}</li>
          <li><strong>Age:</strong> ${Age}</li>
          <li><strong>Phone:</strong> ${Phone}</li>
          <li><strong>Address:</strong> ${Address}</li>
          <li><strong>Hire Date:</strong> ${new Date(HireDate).toLocaleDateString()}</li>
          <li><strong>Department:</strong> ${deptName}</li>
        </ul>
        <p>We’re excited to have you on board!</p>
        <p>Best regards,<br/>The Salon Manager Team</p>
      `
    );

    console.log('Employee added successfully:', savedEmployee);
    return res.status(201).json({ employee: savedEmployee, emailSent });
  } catch (err) {
    console.error('Error in addEmployee:', { error: err.message, stack: err.stack, body: req.body });
    if (err.code === 11000) { // MongoDB duplicate key error (e.g., duplicate Email)
      return res.status(400).json({ message: 'Email already exists', error: err.message });
    }
    return res.status(500).json({ message: 'Unable to add employee', error: err.message });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    console.log('Fetching employee by ID:', id);
    const employee = await employeeModel.findById(id).populate('DepartmentId', 'DepartmentName');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    return res.status(200).json({ employee });
  } catch (err) {
    console.error('Error in getById:', { error: err.message, stack: err.stack });
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const { EmployeeName, Role, Age, Address, Phone, HireDate, DepartmentId, Email } = req.body;
  const ProfilePicture = req.file ? `/Uploads/${req.file.filename}` : undefined;
  try {
    console.log('Updating employee with ID:', id, 'Data:', req.body);
    const oldEmployee = await employeeModel.findById(id);
    if (!oldEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const updateData = {
      EmployeeName,
      Role,
      Age: Number(Age),
      Address,
      Phone,
      HireDate: HireDate ? new Date(HireDate) : oldEmployee.HireDate,
      DepartmentId,
      Email,
    };
    if (ProfilePicture) updateData.ProfilePicture = ProfilePicture;
    const employee = await employeeModel.findByIdAndUpdate(id, updateData, { new: true });
    if (oldEmployee.DepartmentId.toString() !== DepartmentId) {
      await departmentModel.findByIdAndUpdate(oldEmployee.DepartmentId, { $inc: { EmployeeCount: -1 } }, { new: true });
      await departmentModel.findByIdAndUpdate(DepartmentId, { $inc: { EmployeeCount: 1 } }, { new: true });
    }
    const department = await departmentModel.findById(DepartmentId);
    const deptName = department ? department.DepartmentName : 'Unknown';
    const emailSent = await sendEmail(
      Email,
      'Profile Updated',
      `Hi ${EmployeeName},\nYour profile has been updated!\nDetails:\n- Role: ${Role}\n- Age: ${Age}\n- Phone: ${Phone}\n- Address: ${Address}\n- Hire Date: ${new Date(HireDate).toLocaleDateString()}\n- Department: ${deptName}`,
      `
        <h1>Profile Updated, ${EmployeeName}!</h1>
        <p>Your profile has been updated. Here are your details:</p>
        <ul>
          <li><strong>Role:</strong> ${Role}</li>
          <li><strong>Age:</strong> ${Age}</li>
          <li><strong>Phone:</strong> ${Phone}</li>
          <li><strong>Address:</strong> ${Address}</li>
          <li><strong>Hire Date:</strong> ${new Date(HireDate).toLocaleDateString()}</li>
          <li><strong>Department:</strong> ${deptName}</li>
        </ul>
        <p>Best regards,<br/>The Salon Manager Team</p>
      `
    );
    return res.status(200).json({ employee, emailSent });
  } catch (err) {
    console.error('Error in updateEmployee:', { error: err.message, stack: err.stack });
    return res.status(500).json({ message: 'Unable to update employee', error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    console.log('Deleting employee with ID:', id);
    const employee = await employeeModel.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await departmentModel.findByIdAndUpdate(employee.DepartmentId, { $inc: { EmployeeCount: -1 } }, { new: true });
    const emailSent = await sendEmail(
      employee.Email,
      'Account Removed',
      `Hi ${employee.EmployeeName},\nYour account has been removed from the salon system.`,
      `
        <h1>Account Removed</h1>
        <p>Hi ${employee.EmployeeName},</p>
        <p>Your account has been removed from the salon system.</p>
        <p>Best regards,<br/>The Salon Manager Team</p>
      `
    );
    return res.status(200).json({ employee, emailSent });
  } catch (err) {
    console.error('Error in deleteEmployee:', { error: err.message, stack: err.stack });
    return res.status(500).json({ message: 'Unable to delete employee' });
  }
};

const sendNotice = async (req, res) => {
  const { message } = req.body;
  try {
    console.log('Sending notice to employees:', message);
    const employees = await employeeModel.find({}, 'Email EmployeeName');
    const promises = employees.map((emp) =>
      sendEmail(
        emp.Email,
        'Salon Notice',
        `Hi ${emp.EmployeeName},\n${message}`,
        `
          <h1>Salon Notice</h1>
          <p>Hi ${emp.EmployeeName},</p>
          <p>${message}</p>
          <p>Best regards,<br/>The Salon Manager Team</p>
        `
      )
    );
    const results = await Promise.all(promises);
    const emailSent = results.every((result) => result);
    return res.status(200).json({ message: 'Notice sent successfully to all employees', emailSent });
  } catch (err) {
    console.error('Error in sendNotice:', { error: err.message, stack: err.stack });
    return res.status(500).json({ message: 'Failed to send notice', error: err.message });
  }
};

export { upload, getAllEmployees, addEmployee, getById, updateEmployee, deleteEmployee, sendNotice };