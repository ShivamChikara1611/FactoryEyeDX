import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { EmployeeContext } from "../context/EmployeeContext";
import axios from "axios";
import { toast } from 'react-toastify';


const Login = () => {
    const [state, setState] = useState('Admin');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setAToken } = useContext(AdminContext);
    const { setEToken } = useContext(EmployeeContext);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {

            if (state === 'Admin') {

                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });

                if (data.success) {
                    localStorage.setItem('aToken', data.token);
                    setAToken(data.token);
                    toast.success("Admin logged in Successfully");
                }
                else {
                    toast.error(data.message);
                }

            } else if (state === 'Employee') {
                const { data } = await axios.post(backendUrl + '/api/employee/login', { email, password });

                if (data.success) {
                    localStorage.setItem('eToken', data.token);
                    setEToken(data.token);
                    toast.success("Employee logged in Successfully");

                    // Fetch profile after login
                    const profileRes = await axios.get(backendUrl + '/api/employee/profile', {
                        headers: { Authorization: `Bearer ${data.token}` }
                    });
                    if (profileRes.data.success) {
                        setEmployeeProfile(profileRes.data.employee);
                    }
                }
                else {
                    toast.error(data.message);
                }
            }
        }
        catch (error) {
            console.log(error.response);
            toast.error(error.message);
        }
    };


    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center text-gray-800">
            <div className="border-2 border-opacity-70 border-primary flex flex-col gap-4 m-auto items-start p-5 sm:p-10 w-fit] sm:min-w-96 rounded-xl text-gray-800 text-sm">
                <p className="text-2xl font-semibold m-auto"><span className="text-primary"> {state} </span> Login</p>
                <div className="w-full">
                    <p>Email</p>
                    <input className="border border-opacity-70 border-primary rounded w-full p-2 mt-1 bg-transparent" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="w-full">
                    <p>Password</p>
                    <input className="border border-opacity-70 border-primary rounded w-full p-2 mt-1 bg-transparent" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="text-white border-2 border-primary text-md mt-4 w-full bg-primary rounded-md py-2 hover:bg-transparent hover:text-primary hover:border-2 hover:border-primary hover:scale-105 transition-all duration-300 px-10">Login</button>

                {
                    state === 'Admin' ? (
                        <p className="text-center text-sm mt-2">Employee Login? <span onClick={() => setState('Employee')} className="text-primary cursor-pointer">Click Here</span></p>
                    ) : (
                        <p className="text-center text-sm mt-2">Admin Login? <span onClick={() => setState('Admin')} className="text-primary cursor-pointer">Click Here</span></p>
                    )
                }
            </div>
        </form>
    );
};

export default Login;
