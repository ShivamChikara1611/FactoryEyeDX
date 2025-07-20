import express from 'express';
import { empList, loginEmployee, sensorEmployee, sensorComplete, sensorCancel, employeeDashboard, employeeProfile, updateEmployeeProfile, completedTask } from '../controllers/employeeController.js';
import authEmployee from '../middlewares/authEmployee.js';


const employeeRoute = express.Router();

employeeRoute.get('/list', empList);
employeeRoute.post('/login', loginEmployee);
employeeRoute.get('/issue',authEmployee, sensorEmployee);
employeeRoute.post('/complete-issue',authEmployee, sensorComplete);
employeeRoute.post('/cancel-issue',authEmployee, sensorCancel);
employeeRoute.get('/dashboard',authEmployee, employeeDashboard);
employeeRoute.get('/profile',authEmployee, employeeProfile);
employeeRoute.post('/update-profile',authEmployee, updateEmployeeProfile);

employeeRoute.post('/task', authEmployee, completedTask);


export default employeeRoute;