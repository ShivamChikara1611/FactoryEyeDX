import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const AllSensors = () => {
    const { employees, aToken, getAllEmployees } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);

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
            (availabilityFilter === 'available' && employee.available) ||
            (availabilityFilter === 'not_available' && !employee.available);

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

    return (
        <div className='w-full overflow-scroll'>
            {/* Filters */}
            <div className='flex justify-even mb-3 gap-3'>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border border-primary rounded-full px-5 py-1.5'
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
            <TableContainer component={Paper} className='mb-5'>
                <Table sx={{ minWidth: 700 }} aria-label="employee table">
                    <TableHead className='bg-third'>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Available</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='bg-third/20'>
                        {visibleEmployees.map((employee, index) => (
                            <TableRow key={index}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.experience}</TableCell>
                                <TableCell>{employee.available ? 'Yes' : 'No'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Load More Button */}
            {visibleCount < filteredEmployees.length && (
                <div className='mb-5 flex justify-center'>
                    <button className='bg-primary text-white px-5 py-2 rounded-full' onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllSensors;
