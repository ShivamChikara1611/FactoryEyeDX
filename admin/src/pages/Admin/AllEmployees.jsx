import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Modal, Box, Button
} from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const AllEmployees = () => {
    const { employees, aToken, getAllEmployees, updateEmployee, deleteEmployee } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', experience: '', available_status: false });


    useEffect(() => {
        if (aToken) {
            getAllEmployees();
        }
    }, [aToken]);

    const filteredEmployees = employees.filter((employee) => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesNameOrEmail =
            employee.name.toLowerCase().includes(lowerSearch) ||
            employee.email.toLowerCase().includes(lowerSearch);

        const matchesAvailability =
            availabilityFilter === '' ||
            (availabilityFilter === 'available' && employee.available_status) ||
            (availabilityFilter === 'not_available' && !employee.available_status);

        const experienceValue = parseInt(employee.experience); // "5 Years" → 5
        const experienceFilterValue = parseInt(experienceFilter);
        const matchesExperience =
            experienceFilter === '' || experienceValue >= experienceFilterValue;

        return matchesNameOrEmail && matchesAvailability && matchesExperience;
    });

    const visibleEmployees = filteredEmployees.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    // Open modal and set form data
    const handleEditClick = (employee) => {
        setEditEmployee(employee);
        setEditForm({
            name: employee.name,
            email: employee.email,
            experience: employee.experience,
            available_status: employee.available_status
        });
        setEditModalOpen(true);
    };

    // Handle update submit
    const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateEmployee(editEmployee.empId, editForm); // Use empId instead of _id
    setEditModalOpen(false);
};

    // Handle delete
    const handleDeleteClick = (empId) => { // Use empId instead of _id
    if (window.confirm("Are you sure you want to delete this employee?")) {
        deleteEmployee(empId);
    }
};

    return (
        <div className='overflow-scroll relative'>
            {/* Filters */}
            <div className='fixed flex mb-3 gap-3 right-5'>
                <input
                    type="text"
                    placeholder="Search by name or email . . ."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='rounded-full px-5 py-1.5 w-[300px]'
                />

                <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className='border border-primary rounded-md text-gray-500 px-4 py-1.5'
                >
                    <option value="">All Availability</option>
                    <option value="available">Available</option>
                    <option value="not_available">Not Available</option>
                </select>

                <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className='border border-primary rounded-md text-gray-500 px-4 py-1.5'
                >
                    <option value="">All Experience</option>
                    <option value="1">1+ Years</option>
                    <option value="3">3+ Years</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                </select>
            </div>

            {/* Table Display */}
            <TableContainer component={Paper} className='mt-[50px] overflow-scroll h-[70vh]'>
                <Table sx={{ minWidth: 700 }} aria-label="employee table">
                    <TableHead className='bg-white'>
                        <TableRow>
                            <TableCell>Emp ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Available</TableCell>
                            <TableCell>Tasks Completed</TableCell>
                            <TableCell>Desk Accepted</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='bg-primary'>
                        {visibleEmployees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.empId}</TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.experience}</TableCell>
                                <TableCell>{employee.available_status ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{employee.tasksCompleted}</TableCell>
                                <TableCell>{employee.deskAccepted ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEditClick(employee)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteClick(employee.empId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Modal */}
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 300
                }}>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className='mb-3'>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className='border rounded px-2 py-1 w-full'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                className='border rounded px-2 py-1 w-full'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label>Experience:</label>
                            <input
                                type="text"
                                value={editForm.experience}
                                onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                className='border rounded px-2 py-1 w-full'
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label>Available:</label>
                            <select
                                value={editForm.available_status}
                                onChange={e => setEditForm({ ...editForm, available_status: e.target.value === "true" })}
                                className='border rounded px-2 py-1 w-full'
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button type="submit" variant="contained" color="primary">Save</Button>
                            <Button onClick={() => setEditModalOpen(false)} variant="outlined">Cancel</Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Load More Button */}
            {visibleCount < filteredEmployees.length && (
                <div className='left-1/2 fixed bottom-2'>
                    <button className='bg-main text-white px-5 py-2 rounded-full' onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllEmployees;
