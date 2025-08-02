import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const ADashboard = () => {
    const { getDashboardData } = useContext(AdminContext);
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getDashboardData();
            setDashboard(data);

            // Toast for exceeded sensor thresholds
            if (data && data.exceededThresholds && data.exceededThresholds.length > 0) {
                data.exceededThresholds.forEach(({ type, avg, threshold }) => {
                    toast.warn(`The average value for ${type} sensors (${avg}) is too high! Threshold: ${threshold}. Check the sensor.`);
                });
            }
        };
        fetchData();
    }, [getDashboardData]);

    if (!dashboard) return <div className="p-10 text-center">Loading dashboard...</div>;

    // Prepare chart data
    const sensorTypeData = Object.entries(dashboard.sensorsByType).map(([type, count]) => ({ type, count }));
    const avgSensorData = Object.entries(dashboard.avgValuesByType).map(([type, avg]) => ({ type, avg }));
    const statusData = [
        { label: 'Completed', value: dashboard.statusCounts.completed },
        { label: 'Pending', value: dashboard.statusCounts.pending },
        { label: 'In Progress', value: dashboard.statusCounts.inprogress },
        { label: 'Cancelled', value: dashboard.statusCounts.cancelled }
    ];

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Factory Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Employees</h3>
                    <p className="text-4xl font-bold text-primary">{dashboard.Employees}</p>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Sensors</h3>
                    <p className="text-4xl font-bold text-primary">{dashboard.sensors}</p>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Tasks</h3>
                    <PieChart
                        series={[
                            {
                                data: statusData.map((d, i) => ({
                                    id: i,
                                    value: d.value,
                                    label: d.label
                                })),
                                innerRadius: 40,
                                outerRadius: 80,
                                paddingAngle: 2,
                                cornerRadius: 5,
                            },
                        ]}
                        width={200}
                        height={200}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Sensors by Type</h3>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: sensorTypeData.map(d => d.type) }]}
                        series={[{ data: sensorTypeData.map(d => d.count), label: 'Count' }]}
                        width={400}
                        height={250}
                    />
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Average Sensor Values</h3>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: avgSensorData.map(d => d.type) }]}
                        series={[{ data: avgSensorData.map(d => d.avg), label: 'Average Value' }]}
                        width={400}
                        height={250}
                    />
                    <ul className="mt-4">
                        {avgSensorData.map(({ type, avg }) => (
                            <li key={type} className="text-sm">
                                <span className="font-semibold">{type}:</span> {avg}
                                {dashboard.exceededThresholds.some(e => e.type === type) && (
                                    <span className="text-red-500 ml-2">⚠️ High Value</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ADashboard;