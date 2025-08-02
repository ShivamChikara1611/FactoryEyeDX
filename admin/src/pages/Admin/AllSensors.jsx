import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, FormControl, Select,
    MenuItem, InputLabel
} from '@mui/material';
import { AdminContext } from '../../context/AdminContext';

const AllSensors = () => {
    const { sensors, aToken, getAllSensors } = useContext(AdminContext);
    const [selectedType, setSelectedType] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSensors = async () => {
            if (aToken) {
                setLoading(true);
                await getAllSensors();
                setLoading(false);
            }
        };
        fetchSensors();
    }, [aToken]);

    const uniqueTypes = [...new Set(sensors.map((sensor) => sensor.type))];

    const filteredSensors = sensors.filter((sensor) => {
        return selectedType === '' || sensor.type === selectedType;
    });

    const visibleSensors = filteredSensors.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
            </div>
        );
    }

    return (
        <div className='w-full overflow-scroll'>
            {/* Dropdown Filter for Sensor Type */}
            <div className='mb-3 w-full'>
                <FormControl className="w-full">
                    <InputLabel>Sensor Type</InputLabel>
                    <Select
                        value={selectedType}
                        label="Sensor Type"
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {uniqueTypes.map((type, index) => (
                            <MenuItem key={index} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                        {visibleSensors.map((sensor, index) => (
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
                    <button
                        className='bg-primary text-white px-5 py-2 rounded-full'
                        onClick={handleLoadMore}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllSensors;
