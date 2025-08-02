import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import employeeModel from "../models/employeeModel.js";
import sensorModel from "../models/sensorModel.js";
import issueModel from "../models/issueModel.js";


// API for employee login
const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await employeeModel.findOne({ email });

        if (!employee) {
            return res.json({
                success: false,
                message: "Employee not found"
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

const getEmployeeProfile = async (req, res) => {
    try {
        const employee = await employeeModel.findById(req.employeeId).select('-password');
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update employee profile
const updateEmployeeProfile = async (req, res) => {
    try {
        const updateFields = {};
        const allowedFields = ['name', 'email', 'experience'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        const employee = await employeeModel.findByIdAndUpdate(
            req.employeeId,
            { $set: updateFields },
            { new: true, select: '-password' }
        );

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }
        res.json({ success: true, employee });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//Update the issue
const updateIssueById = async (req, res) => {
    try {
        const issueId = req.params.id;
        const updates = req.body;

        const updated = await issueModel.findByIdAndUpdate(issueId, { $set: updates }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        res.json({ success: true, issue: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getIssuesByEmployee = async (req, res) => {
    try {
        const empId = req.params.empId;
        const issues = await issueModel.find({ empId });
        res.json({ success: true, issues });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching issues" });
    }
};

const updateDeskAcceptedStatus = async (req, res) => {
    try {
        const empId = req.params.empId;
        const { deskAccepted } = req.body;

        const updateFields = {
            deskAccepted,
            available_status: !deskAccepted
        };

        if (!deskAccepted) {
            updateFields.taskAssignedId = ""; // Clear task assignment if declined
        }

        const employee = await employeeModel.findOneAndUpdate(
            { empId },
            updateFields,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({ success: true, message: "Employee updated", employee });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { loginEmployee, employeeDashboard, getEmployeeProfile, updateEmployeeProfile, updateIssueById, getIssuesByEmployee, updateDeskAcceptedStatus };
