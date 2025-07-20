import validator from "validator";
import bcrypt from "bcryptjs";
import employeeModel from "../models/employeeModel.js";
import jwt from "jsonwebtoken";
import sensorModel from "../models/sensorModel.js";
import issueModel from "../models/issueModel.js";


// API for adding Employee
const addEmployee = async (req, res) => {
    try {
        const { name, email, password, experience } = req.body;

        // checking for all data to add Employee
        if (!name || !email || !password || !experience) {
            return res.json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email"
            })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password must be at least 8 characters"
            })
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const EmployeeData = {
            name,
            email,
            password: hashedPassword,
            experience,
            date: Date.now()
        }

        const newEmployee = new employeeModel(EmployeeData);
        await newEmployee.save();

        res.json({
            success: true,
            message: "Employee Added Successfully"
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}


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
        const Employees = await employeeModel.find({}).select('-password'); //to remove password from the response
        res.json({
            success: true,
            Employees
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
        res.status(200).json(sensors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching sensors", error });
    }
};

// API to get all issues for admin panel
const getAllIssues = async (req, res) => {
    try {
        const issues = await issueModel.find({}).sort({ assignDate: -1, assignTime: -1 });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: "Error fetching issues", error });
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

// API to create a new sensor
const createSensor = async (req, res) => {
    try {
        const { name, type, value, unit } = req.body;

        // checking for all data to add sensor
        if (!name || !type || !value || !unit) {
            return res.json({
                success: false,
                message: "Please fill all the fields"
            })
        }

        const sensorData = {
            name,
            type,
            value,
            unit,
            timestamp: new Date().toISOString()
        }

        const newSensor = new sensorModel(sensorData);
        await newSensor.save();

        res.json({
            success: true,
            message: "Sensor Added Successfully"
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
};

// API to update an existing sensor
const updateSensor = async (req, res) => {
    try {
        const updatedSensor = await sensorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedSensor) return res.status(404).json({ message: "Sensor not found" });

        updatedSensor.timestamp = new Date().toISOString(); // Update timestamp on modification
        await updatedSensor.save();
        
        res.status(200).json(updatedSensor);
    } catch (error) {
        res.status(500).json({ message: "Error updating sensor", error });
    }
};

// API to delete a sensor
const deleteSensor = async (req, res) => {
    try {
        const deletedSensor = await sensorModel.findByIdAndDelete(req.params.id);
        if (!deletedSensor) return res.status(404).json({ message: "Sensor not found" });
        res.status(200).json({ message: "Sensor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting sensor", error });
    }
};


// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const Employees = await employeeModel.find({});
        const sensors = await sensorModel.find({});

        // Group sensors by type
        const sensorsByType = {};
        const avgSensorValues = {};

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

        // Calculate average values by type
        const avgValuesByType = {};
        for (let type in avgSensorValues) {
            avgValuesByType[type] = parseFloat(
                (avgSensorValues[type].total / avgSensorValues[type].count).toFixed(2)
            );
        }

        const dashData = {
            Employees: Employees.length,
            sensors: sensors.length,
            sensorsByType,
            avgValuesByType
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

// API to assign sensor issue for employee panel
const assignTask = async (req, res) => {
    try {
        const { empId, sensorId, issueDescription, priority } = req.body;

        if (!empId || !sensorId || !issueDescription || !priority) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const date = new Date();
        const assignDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        const assignTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

        // Get employee and sensor
        const employee = await employeeModel.findById(empId);
        const sensor = await sensorModel.findById(sensorId);

        if (!employee) return res.json({ success: false, message: "Employee not found" });
        if (!sensor) return res.json({ success: false, message: "Sensor not found" });

        // Check slot availability
        const slots = employee.slots_booked || {};
        if (!slots[assignDate]) slots[assignDate] = [];

        if (slots[assignDate].includes(assignTime)) {
            return res.json({
                success: false,
                message: "Employee not available at this time!"
            });
        }

        // Book the slot
        slots[assignDate].push(assignTime);
        employee.slots_booked = slots;
        await employee.save();

        // Prepare issue data
        const issue = new issueModel({
            empId: employee._id,
            empData: {
                name: employee.name,
                email: employee.email,
                experience: employee.experience
            },

            sensorId: sensor._id,
            sensorData: {
                name: sensor.name,
                type: sensor.type,
                value: sensor.value,
                unit: sensor.unit
            },

            issueId: `ISSUE-${Date.now()}`, // unique issue ID
            issueDescription,
            priority,

            assignDate,
            assignTime,

            completionDate: "None", // to be updated later
            completionTime: "None", // to be updated later

            status: "pending"
        });

        await issue.save();

        return res.json({
            success: true,
            message: "Task assigned successfully",
            issue
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
}


export { addEmployee, loginAdmin, allEmployees, getAllSensors, adminDashboard, getSensorById, createSensor, updateSensor, deleteSensor, assignTask, getAllIssues };