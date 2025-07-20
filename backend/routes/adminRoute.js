import express from "express";
import {addEmployee, loginAdmin, allEmployees, adminDashboard, getAllSensors, getSensorById, createSensor, updateSensor, deleteSensor, assignTask, getAllIssues} from "../controllers/adminController.js";
import {changeAvailablity} from "../controllers/employeeController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";



const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin); //no middleware needed for login

adminRouter.post('/add-employee',authAdmin, upload.single("image"), addEmployee);

adminRouter.post('/all-employees', authAdmin, allEmployees);
adminRouter.get('/sensors', authAdmin, getAllSensors);
adminRouter.get('/issues', authAdmin, getAllIssues);

adminRouter.post('/change-availability', authAdmin, changeAvailablity);

adminRouter.get("/sensors/:id", authAdmin, getSensorById);
adminRouter.post("/sensors", authAdmin, createSensor);
adminRouter.put("/sensors/:id", authAdmin, updateSensor);
adminRouter.delete("/sensors/:id", authAdmin, deleteSensor);

adminRouter.post('/assign-task', authAdmin, assignTask);

adminRouter.get('/dashboard', authAdmin, adminDashboard);


export default adminRouter;