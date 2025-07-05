// backend/Routes/employeeRoute.js
const express = require('express');
const router = express.Router();
const employeeController = require('../Controlers/employeeControl');

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.upload.single('ProfilePicture'), employeeController.addEmployee);
router.get('/:id', employeeController.getById);
router.put('/:id', employeeController.upload.single('ProfilePicture'), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;