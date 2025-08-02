import express from 'express';
import { loginEmployee, employeeDashboard, getEmployeeProfile, updateEmployeeProfile, updateIssueById, getIssuesByEmployee, updateDeskAcceptedStatus } from '../controllers/employeeController.js';
import authEmployee from '../middlewares/authEmployee.js';


const employeeRoute = express.Router();

employeeRoute.post('/login', loginEmployee);

employeeRoute.get('/dashboard',authEmployee, employeeDashboard);

employeeRoute.get('/profile', authEmployee, getEmployeeProfile);
employeeRoute.put('/profile', authEmployee, updateEmployeeProfile);

employeeRoute.get('/issues/by-employee/:empId', authEmployee, getIssuesByEmployee );
employeeRoute.put('/issues/:id', authEmployee, updateIssueById);

employeeRoute.put('/update-desk-accepted/:empId', authEmployee, updateDeskAcceptedStatus);


export default employeeRoute;