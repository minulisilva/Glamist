import express from 'express';
import { getAllDepartments, addDepartment, getById, updateDepartment, deleteDepartment } from '../controllers/departmentControl.js';

const router = express.Router();

router.get('/', getAllDepartments); // Fetch all departments
router.post('/', addDepartment); // Add a new department
router.get('/:id', getById); // Fetch a department by ID
router.put('/:id', updateDepartment); // Update a department by ID
router.delete('/:id', deleteDepartment); // Delete a department by ID

export default router;