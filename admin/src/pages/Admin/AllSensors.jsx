import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper
} from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const AllSensors = () => {
    const { sensors, aToken, getAllSensors } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [valueFilter, setValueFilter] = useState('');
    const [unitFilter, setUnitFilter] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        if (aToken) {
            getAllSensors();
        }
    }, [aToken]);

    const filteredSensors = sensors.filter((sensor) => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesNameOrValue =
            sensor.name.toLowerCase().includes(lowerSearch) ||
            sensor.type.toLowerCase().includes(lowerSearch);


        return matchesNameOrValue;
    });

    const visiblesensors = filteredSensors.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    return (
        <div className='w-full overflow-scroll'>
            {/* Filters */}
            <div className='flex justify-even mb-3 gap-3'>
                <input
                    type="text"
                    placeholder="Search by name or type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='border border-primary rounded-full px-5 py-1.5'
                />
            </div>

            {/* Table Display */}
            <TableContainer component={Paper} className='mb-5'>
                <Table sx={{ minWidth: 700 }} aria-label="sensor table">
                    <TableHead className='bg-third'>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell>Unit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className='bg-third/20'>
                        {visiblesensors.map((sensor, index) => (
                            <TableRow key={index}>
                                <TableCell>{sensor.name}</TableCell>
                                <TableCell>{sensor.type}</TableCell>
                                <TableCell>{sensor.value}</TableCell>
                                <TableCell>{sensor.unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Load More Button */}
            {visibleCount < filteredSensors.length && (
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
