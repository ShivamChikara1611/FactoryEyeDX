import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import employeeModel from "../models/employeeModel.js";
import sensorModel from "../models/sensorModel.js";
import issueModel from "../models/issueModel.js";


// API for adding Employee
const addEmployee = async (req, res) => {
    try {
        const { name, email, password, experience } = req.body;

        // Validate required fields
        if (!name || !email || !password || !experience) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate empId
        const count = await employeeModel.countDocuments();
        // const empId = `emp${10000 + count + 1}`;
        const empId = `emp${Date.now()}${Math.floor(Math.random() * 1000)}`;


        const EmployeeData = {
            name,
            empId,
            email,
            password: hashedPassword,
            experience,
            available_status: true,
            taskAssignedId: "",
            tasksCompleted: 0,
            deskAccepted: false
        };

        const newEmployee = new employeeModel(EmployeeData);
        await newEmployee.save();

        res.json({
            success: true,
            message: "Employee Added Successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};


// API for login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid email or password"
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

// API to get all Employees list for admin panel
const allEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({}).select('-password'); //to remove password from the response
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

// API to get all sensors for admin panel
const getAllSensors = async (req, res) => {
    try {
        const sensors = await sensorModel.find().sort({ timestamp: -1 });
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
};

// API to get all issues for admin panel
const getAllIssues = async (req, res) => {
    try {
        const issues = await issueModel.find({}).sort({ assignDate: -1, assignTime: -1 });
        res.json({
            success: true,
            issues
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
};

// API to get sensor by ID
const getSensorById = async (req, res) => {
    try {
        const sensor = await sensorModel.findById(req.params.id);
        if (!sensor) return res.status(404).json({ message: "Sensor not found" });
        res.status(200).json(sensor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sensor", error });
    }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const Employees = await employeeModel.find({});
        const sensors = await sensorModel.find({});
        const issues = await issueModel.find({});

        // Group sensors by type and calculate averages
        const sensorsByType = {};
        const avgSensorValues = {};
        const sensorThresholds = {
            temperature: 30,
            humidity: 70,
            vibration: 4,
            pressure: 120
        };

        sensors.forEach((sensor) => {
            const { type, value } = sensor;
            if (!sensorsByType[type]) {
                sensorsByType[type] = 0;
                avgSensorValues[type] = { total: 0, count: 0 };
            }
            sensorsByType[type] += 1;
            avgSensorValues[type].total += value;
            avgSensorValues[type].count += 1;
        });

        // Calculate average values by type and check thresholds
        const avgValuesByType = {};
        const exceededThresholds = [];
        for (let type in avgSensorValues) {
            const avg = parseFloat(
                (avgSensorValues[type].total / avgSensorValues[type].count).toFixed(2)
            );
            avgValuesByType[type] = avg;
            if (sensorThresholds[type] && avg > sensorThresholds[type]) {
                exceededThresholds.push({ type, avg, threshold: sensorThresholds[type] });
            }
        }

        // Task status counts
        const statusCounts = {
            completed: 0,
            pending: 0,
            inprogress: 0,
            cancelled: 0
        };
        issues.forEach(issue => {
            if (issue.status === "completed") statusCounts.completed += 1;
            else if (issue.status === "pending") statusCounts.pending += 1;
            else if (issue.status === "in-progress" || issue.status === "in progress") statusCounts.inprogress += 1;
            else if (issue.status === "cancelled") statusCounts.cancelled += 1;
        });

        const dashData = {
            Employees: Employees.length,
            sensors: sensors.length,
            sensorsByType,
            avgValuesByType,
            statusCounts,
            exceededThresholds
        };

        res.json({
            success: true,
            dashData
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}

// API to assign task to the employee in the admin panel
const assignTask = async (req, res) => {
    try {
        const { empId, sensorId, issueDescription, priority } = req.body;

        // Validate required fields
        if (!empId || !sensorId || !issueDescription || !priority) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Find employee
        const employee = await employeeModel.findOne({ empId });
        if (!employee) {
            return res.json({ success: false, message: "Employee not found" });
        }

        // Check if employee is available
        if (!employee.available_status) {
            return res.json({ success: false, message: "Employee is not available for new tasks" });
        }

        // Check if employee has any incomplete issues
        const incompleteIssue = await issueModel.findOne({ empId, status:"pending" || "in-progress" });
        if (incompleteIssue) {
            return res.json({ success: false, message: "Employee already has an incomplete task assigned" });
        }

        // Find sensor
        const sensor = await sensorModel.findOne({ sensorId });
        if (!sensor) {
            return res.json({ success: false, message: "Sensor not found" });
        }

        // Generate issueId
        const count = await issueModel.countDocuments();
        const issueId = `issue${Date.now()}${Math.floor(Math.random() * 1000)}`;


        // Create issue
        const newIssue = new issueModel({
            issueId,
            sensorId,
            empId,
            empName: employee.name,
            empEmail: employee.email,
            issueDescription,
            priority,
            isCompleted: false
        });

        await newIssue.save();

        // Update employee available_status to false and set taskAssignedId
        employee.available_status = false;
        employee.taskAssignedId = issueId;
        employee.deskAccepted = false;
        await employee.save();

        res.json({
            success: true,
            message: "Task assigned successfully",
            issue: newIssue
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to update employee
const updateEmployee = async (req, res) => {
    try {
        const { name, email, experience, available_status } = req.body;
        const empId = String(req.params.id); // Note: param is 'id' in your route

        const updated = await employeeModel.findOneAndUpdate(
            { empId }, 
            { name, email, experience, available_status },
            { new: true }
        );

        if (!updated) {
            return res.json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee updated", employee: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API to delete employee
const deleteEmployee = async (req, res) => {
    try {
        const empId = String(req.params.id); // Note: param is 'id' in your route
        const deleted = await employeeModel.findOneAndDelete({ empId }); // Find by empId

        if (!deleted) {
            return res.json({ success: false, message: "Employee not found" });
        }

        res.json({ success: true, message: "Employee deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update issue status
const updateIssueStatus = async (req, res) => {
    try {
        const { issueId, status } = req.body;
        let isCompleted = false;
        if (status === "completed") isCompleted = true;

        const updated = await issueModel.findOneAndUpdate(
            { issueId },
            { status, isCompleted },
            { new: true }
        );
        if (!updated) {
            return res.json({ success: false, message: "Issue not found" });
        }

        // If completed, update employee availability
        if (status === "completed") {
            await employeeModel.findOneAndUpdate(
                { empId: updated.empId },
                { available_status: true, taskAssignedId: "" }
            );
        }

        res.json({ success: true, message: "Status updated", issue: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update issue priority
const updateIssuePriority = async (req, res) => {
    try {
        const { issueId, priority } = req.body;
        const updated = await issueModel.findOneAndUpdate(
            { issueId },
            { priority },
            { new: true }
        );
        if (!updated) {
            return res.json({ success: false, message: "Issue not found" });
        }
        res.json({ success: true, message: "Priority updated", issue: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export { 
    addEmployee, loginAdmin, allEmployees, getAllSensors, adminDashboard, getSensorById, assignTask, getAllIssues, updateEmployee, deleteEmployee, updateIssueStatus, updateIssuePriority
};