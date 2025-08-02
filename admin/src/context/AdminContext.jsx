import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");

    const [employees, setEmployees] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [issues, setIssues] = useState([]);


    // Getting all the employees list.
    const getAllEmployees = async () => {

        try{
            const { data } = await axios.post(backendUrl + '/api/admin/all-employees',{}, {
                headers: {
                    aToken
                }
            });

            if(data.success){
                setEmployees(data.employees);
                console.log(data)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // Getting all the sensors list.
    const getAllSensors = async () => {

        try{
            const { data } = await axios.post(backendUrl + '/api/admin/sensors',{}, {
                headers: {
                    aToken
                }
            });

            if(data.success){
                setSensors(data.sensors);
                console.log(data)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // Get all issues
    const getAllIssues = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/issues',{}, {
                headers: { aToken }
            });
            if (data.success) {
                setIssues(data.issues);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Update employee
    const updateEmployee = async (id, updatedData) => {
        try {
            const { data } = await axios.put(
                backendUrl + `/api/admin/employee/${id}`,
                updatedData,
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllEmployees();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Delete employee
    const deleteEmployee = async (id) => {
        try {
            const { data } = await axios.delete(
                backendUrl + `/api/admin/employee/${id}`,
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllEmployees();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Get dashboard data
    const getDashboardData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
                headers: { aToken }
            });
            if (data.success) {
                return data.dashData;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    // Update issue status
    const updateIssueStatus = async (issueId, status) => {
    try {
        const { data } = await axios.put(
            backendUrl + '/api/admin/issue/status',
            { issueId, status },
            { headers: { aToken } }
        );
        if (data.success) {
            toast.success(data.message);
            getAllIssues();
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
};

    // Update issue priority
    const updateIssuePriority = async (issueId, priority) => {
        try {
            const { data } = await axios.put(
                backendUrl + '/api/admin/issue/priority',
                { issueId, priority },
                { headers: { aToken } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllIssues();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };


    const value = {
        aToken, setAToken, getAllEmployees, employees, getAllSensors, sensors, getAllIssues, issues, updateEmployee, deleteEmployee, getDashboardData, updateIssueStatus, updateIssuePriority
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
