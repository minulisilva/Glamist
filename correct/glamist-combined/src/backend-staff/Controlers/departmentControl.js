const Department = require('../Models/departmentModel'); // Fixed casing
const Employee = require('../Models/employeeModel');

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    if (!departments.length) {
      return res.status(404).json({ message: 'No departments found' });
    }
    // Fetch employees with _id and ProfilePicture for each department
    const departmentsWithEmployees = await Promise.all(
      departments.map(async (dept) => {
        const employees = await Employee.find({ DepartmentId: dept._id }).select('_id ProfilePicture');
        return {
          ...dept._doc,
          employees, // Return full employee objects with _id and ProfilePicture
        };
      })
    );
    return res.status(200).json({ departments: departmentsWithEmployees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const dept = await Department.findById(id);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const employees = await Employee.find({ DepartmentId: id }).select('_id ProfilePicture');
    const departmentWithEmployees = {
      ...dept._doc,
      employees, // Return full employee objects with _id and ProfilePicture
    };
    return res.status(200).json({ departments: departmentWithEmployees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// No changes needed for these, but update response for consistency
const addDepartments = async (req, res, next) => {
  const { DepartmentName, Description } = req.body;
  try {
    const newDepartment = new Department({
      DepartmentName,
      Description,
      EmployeeCount: 0,
    });
    await newDepartment.save();
    return res.status(201).json({ departments: newDepartment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to add department' });
  }
};

const updateDepartments = async (req, res, next) => {
  const id = req.params.id;
  const { DepartmentName, Description } = req.body;
  try {
    const departments = await Department.findByIdAndUpdate(
      id,
      { DepartmentName, Description },
      { new: true }
    );
    if (!departments) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const employees = await Employee.find({ DepartmentId: id }).select('_id ProfilePicture');
    const departmentWithEmployees = {
      ...departments._doc,
      employees,
    };
    return res.status(200).json({ departments: departmentWithEmployees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to update department' });
  }
};

const deleteDepartments = async (req, res, next) => {
  const id = req.params.id;
  try {
    const departments = await Department.findByIdAndDelete(id);
    if (!departments) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.status(200).json({ departments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to delete department' });
  }
};

exports.getAllDepartments = getAllDepartments;
exports.addDepartments = addDepartments;
exports.getById = getById;
exports.updateDepartments = updateDepartments;
exports.deleteDepartments = deleteDepartments;