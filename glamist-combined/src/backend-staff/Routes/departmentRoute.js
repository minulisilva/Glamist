const express=require("express");
const router=express.Router();
const departmentModel=require("../Models/departmentModel");
const departmentController=require("../Controlers/departmentControl");

router.get("/",departmentController.getAllDepartments);
router.post("/",departmentController.addDepartments);
router.get("/:id",departmentController.getById);
router.put("/:id",departmentController.updateDepartments);
router.delete("/:id",departmentController.deleteDepartments);
module.exports=router;