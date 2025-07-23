import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"");

    const [employees, setEmployees] = useState([]);
    const [sensors, setSensors] = useState([]);


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


    const value = {
        aToken, setAToken, getAllEmployees, employees, getAllSensors, sensors
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
