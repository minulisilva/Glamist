// backend/Routes/employeeRoute.js
import { Router } from 'express';
const router = Router();
import { getAllEmployees, upload, addEmployee, getById, updateEmployee, deleteEmployee } from '../controllers/employeeControl.js';

router.get('/', getAllEmployees);
router.post('/', upload.single('ProfilePicture'), addEmployee);
router.get('/:id', getById);
router.put('/:id', upload.single('ProfilePicture'), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;