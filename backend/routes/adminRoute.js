import express from "express";
import {addEmployee, loginAdmin, allEmployees, adminDashboard, getAllSensors, getSensorById, assignTask, getAllIssues, updateEmployee, deleteEmployee, updateIssueStatus, updateIssuePriority} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";


const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin); //no middleware needed for login

adminRouter.post('/add-employee',authAdmin, upload.single("image"), addEmployee);

adminRouter.post('/all-employees', authAdmin, allEmployees);
adminRouter.post('/sensors', authAdmin, getAllSensors);
adminRouter.post('/issues', authAdmin, getAllIssues);

adminRouter.put('/issue/status', authAdmin, updateIssueStatus);
adminRouter.put('/issue/priority', authAdmin, updateIssuePriority);

adminRouter.get("/sensors/:id", authAdmin, getSensorById);

adminRouter.post('/assign-task', authAdmin, assignTask);

adminRouter.get('/dashboard', authAdmin, adminDashboard);

adminRouter.put('/employee/:id', authAdmin, updateEmployee);

adminRouter.delete('/employee/:id', authAdmin, deleteEmployee);


export default adminRouter;