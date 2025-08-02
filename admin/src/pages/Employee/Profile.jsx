import React, { useContext, useEffect, useState } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext.jsx'
import axios from 'axios'
import { Button, Paper, TextField, Switch, FormControlLabel } from '@mui/material'
import { toast } from 'react-toastify'


const Profile = () => {
    const { eToken, employeeProfile, setEmployeeProfile } = useContext(EmployeeContext);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!employeeProfile && eToken) {
                try {
                    const backendUrl = import.meta.env.VITE_BACKEND_URL;
                    const res = await axios.get(backendUrl + '/api/employee/profile', {
                        headers: { Authorization: `Bearer ${eToken}` }
                    });
                    if (res.data.success) {
                        setEmployeeProfile(res.data.employee);
                        setEditData(res.data.employee);
                    }
                } catch (err) {
                    // handle error
                }
            } else if (employeeProfile) {
                setEditData(employeeProfile);
            }
        };
        fetchProfile();
    }, [eToken, employeeProfile, setEmployeeProfile]);

    if (!eToken) {
        return <div>Please login to view your profile.</div>;
    }

    if (!editData) {
        return <div>Loading profile...</div>;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.put(
                backendUrl + '/api/employee/profile',
                {
                    name: editData.name,
                    email: editData.email,
                    experience: editData.experience
                },
                { headers: { Authorization: `Bearer ${eToken}` } }
            );
            if (res.data.success) {
                setEmployeeProfile(res.data.employee);
                setEditData(res.data.employee);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (err) {
            toast.error("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Paper className="max-w-xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextField
                    label="Employee ID"
                    value={editData.empId}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    label="Name"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                />
                <TextField
                    label="Experience"
                    name="experience"
                    value={editData.experience}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    className="mt-4"
                >
                    Update Profile
                </Button>
            </form>
        </Paper>
    );
};

export default Profile