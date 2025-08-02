import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography
} from '@mui/material';
import { toast } from 'react-toastify';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [employee, setEmployee] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("eToken");

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/employee/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const empData = res.data.employee;
            setEmployee(empData);

            const empId = empData.empId;
            const taskId = empData.taskAssignedId;

            if (!taskId) {
                setTasks([]);
                return;
            }

            const taskRes = await axios.get(`${backendUrl}/api/employee/issues/by-employee/${empId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(taskRes.data.issues || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks.");
        }
    };

    const handleDecision = async (taskId, decision) => {
        try {
            const updateIssue = {
                status: decision === "accept" ? "in-progress" : "cancelled",
                isCompleted: false
            };

            const updateEmployee = {
                deskAccepted: decision === "accept"
            };

            await axios.put(`${backendUrl}/api/employee/issues/${taskId}`, updateIssue, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`${backendUrl}/api/employee/update-desk-accepted/${employee.empId}`, updateEmployee, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEmployee(prev => ({
                ...prev,
                deskAccepted: decision === "accept"
            }));

            toast.success(`You have ${decision === "accept" ? "accepted" : "declined"} the task.`);
            fetchTasks(); // Refresh
        } catch (error) {
            console.error(error);
            toast.error("Action failed.");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="p-5">
            <Typography variant="h5" gutterBottom>
                Assigned Tasks
            </Typography>
            {tasks.length === 0 ? (
                <Typography>No tasks assigned currently.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableRow>
                                <TableCell><b>Issue ID</b></TableCell>
                                <TableCell><b>Description</b></TableCell>
                                <TableCell><b>Sensor ID</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell><b>Completed</b></TableCell>
                                <TableCell><b>Desk Accepted</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.issueId}>
                                    <TableCell>{task.issueId}</TableCell>
                                    <TableCell>{task.issueDescription}</TableCell>
                                    <TableCell>{task.sensorId}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>{task.isCompleted ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        {employee?.deskAccepted ? (
                                            "Accepted"
                                        ) : task.status === "cancelled" ? (
                                            "Cancelled"
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleDecision(task._id, "accept")}
                                                    sx={{ marginRight: 1 }}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDecision(task._id, "decline")}
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Tasks;
