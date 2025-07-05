import departmentModel from '../models/departmentModel.js';
import employeeModel from '../models/employeeModel.js';

const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.find();
    if (!departments.length) {
      return res.status(200).json({ departments: [] }); // Return 200 with empty array instead of 404
    }
    const departmentsWithEmployees = await Promise.all(
      departments.map(async (dept) => {
        const employees = await employeeModel.find({ DepartmentId: dept._id }).select('_id ProfilePicture');
        return {
          ...dept.toObject(), // Use toObject() instead of _doc for cleaner Mongoose object handling
          employees,
        };
      })
    );
    return res.status(200).json({ departments: departmentsWithEmployees });
  } catch (err) {
    console.error('Error fetching departments:', err);
    return res.status(500).json({ message: 'Server error while fetching departments' });
  }
};

const getById = async (req, res) => {
  const id = req.params.id;
  try {
    const dept = await departmentModel.findById(id);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const employees = await employeeModel.find({ DepartmentId: id }).select('_id ProfilePicture');
    const departmentWithEmployees = {
      ...dept.toObject(), // Use toObject() instead of _doc
      employees,
    };
    return res.status(200).json({ departments: departmentWithEmployees });
  } catch (err) {
    console.error('Error fetching department by ID:', err);
    return res.status(500).json({ message: 'Server error while fetching department' });
  }
};

const addDepartment = async (req, res) => {
  const { DepartmentName, Description } = req.body;
  try {
    if (!DepartmentName || !Description) {
      return res.status(400).json({ message: 'Department name and description are required' });
    }
    const newDepartment = new departmentModel({
      DepartmentName,
      Description,
      EmployeeCount: 0,
    });
    const savedDepartment = await newDepartment.save();
    return res.status(201).json({ departments: savedDepartment });
  } catch (err) {
    console.error('Error adding department:', err.message, err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Unable to add department', error: err.message });
  }
};

const updateDepartment = async (req, res) => {
  const id = req.params.id;
  const { DepartmentName, Description } = req.body;
  try {
    const department = await departmentModel.findByIdAndUpdate(
      id,
      { DepartmentName, Description },
      { new: true }
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    const employees = await employeeModel.find({ DepartmentId: id }).select('_id ProfilePicture');
    const departmentWithEmployees = {
      ...department.toObject(),
      employees,
    };
    return res.status(200).json({ departments: departmentWithEmployees });
  } catch (err) {
    console.error('Error updating department:', err);
    return res.status(500).json({ message: 'Unable to update department' });
  }
};

const deleteDepartment = async (req, res) => {
  const id = req.params.id;
  try {
    const department = await departmentModel.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    return res.status(200).json({ message: 'Department deleted successfully', id: department._id }); // Return success message and ID
  } catch (err) {
    console.error('Error deleting department:', err);
    return res.status(500).json({ message: 'Unable to delete department' });
  }
};

export { getAllDepartments, addDepartment, getById, updateDepartment, deleteDepartment };