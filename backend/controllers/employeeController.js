import employeeModel from "../models/employeeModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sensorModel from "../models/sensorModel.js";
import issueModel from "../models/issueModel.js";

const changeAvailablity = async (req, res) => {
    try {
        const { empId } = req.body;

        const empData = await employeeModel.findById(empId);
        await employeeModel.findByIdAndUpdate(empId, { available: !empData.available });
        res.json({
            success: true,
            message: "Employee Availability Changed"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

const empList = async (req, res) => {
    try {
        const employees = await employeeModel.find({}).select(['-password']);
        res.json({
            success: true,
            employees
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API for employee login
const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await employeeModel.findOne({ email });

        if (!employee) {
            return res.json({
                success: false,
                message: "employee not found"
            })
        }
        
        const isMatch = await bcrypt.compare(password, employee.password);

        if (isMatch) {
            const token = jwt.sign({id: employee._id}, process.env.JWT_SECRET);
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid password"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API to get employee sensors for employee panel
const sensorEmployee = async (req, res) => {
    try {
        const { empId } = req.body;
        const sensors = await sensorModel.find({ empId });
        res.json({
            success: true,
            sensors
        })


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to mark sensor as completed for employee panel
const sensorComplete = async (req, res) => {
    try {
        const { empId, sensorId } = req.body;

        const sensorDate = await sensorModel.findById(sensorId);

        if(sensorDate && sensorDate.empId === empId){
            await sensorModel.findByIdAndUpdate(sensorId, { isCompleted: true });
            res.json({
                success: true,
                message: "Issue Solved"
            })
        } else {
            res.json({
                success: false,
                message: "Issue Not Found"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API to cancel sensor issue for employee panel
const sensorCancel = async (req, res) => {
    try {
        const { empId, sensorId } = req.body;

        const sensorDate = await sensorModel.findById(sensorId);

        if(sensorDate && sensorDate.empId === empId){
            await sensorModel.findByIdAndUpdate(sensorId, { cancelled: true });
            res.json({
                success: true,
                message: "Issue Request Cancelled"
            })
        } else {
            res.json({
                success: false,
                message: "Cancellation Failed"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get dashboard data for employee panel
const employeeDashboard = async (req, res) => {
    try {
        const { empId } = req.body;
        const sensors = await sensorModel.find({ empId });

        const dashData = {
            sensors: sensors.length,
        }

        res.json({
            success: true,
            dashData
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

//API to get employee profile for employee panel
const employeeProfile = async (req, res) => {
    try {
        const { empId } = req.body;
        const profileData = await employeeModel.findById(empId).select('-password');
        res.json({
            success: true,
            profileData
        })


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to update employee profile for employee panel
const updateEmployeeProfile = async (req, res) => {
    try {
        const { empId, available } = req.body;

        await employeeModel.findByIdAndUpdate(empId, { available });

        res.json({
            success: true,
            message: "Profile Updated"
        })


    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API for employee to complete/cancel/update task status
const completedTask = async (req, res) => {
    try {
        const { empId, issueId, status } = req.body;

        if (!empId || !issueId || !status) {
            return res.json({
                success: false,
                message: "empId, issueId, and status are required"
            });
        }

        // Find the issue assigned to the employee
        const issue = await issueModel.findOne({ issueId, empId });

        if (!issue) {
            return res.json({
                success: false,
                message: "No such issue assigned to this employee"
            });
        }

        // Validate status input
        const allowedStatuses = ["completed", "cancelled", "in progress"];
        if (!allowedStatuses.includes(status)) {
            return res.json({
                success: false,
                message: "Invalid status. Use: completed, cancelled, or in progress"
            });
        }

        // Update issue data based on status
        issue.status = status;

        if (status === "completed") {
            const date = new Date();
            issue.completionDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            issue.completionTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        } else {
            // Clear completion info if not completed
            issue.completionDate = 0;
            issue.completionTime = 0;
        }

        await issue.save();

        return res.json({
            success: true,
            message: `Task marked as ${status}`,
            issue
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}


export { changeAvailablity, empList, loginEmployee, sensorEmployee, sensorComplete, sensorCancel, employeeDashboard, employeeProfile, updateEmployeeProfile, completedTask };
