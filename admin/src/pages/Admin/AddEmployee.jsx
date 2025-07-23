import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";


const AddEmployee = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('');
    const [loading, setLoading] = useState(false);

    const { aToken } = useContext(AdminContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the form is submitted

        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);

            // console the form data
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(`${backendUrl}/api/admin/add-employee`, formData, {
                headers: { aToken }
            });

            if (data.success) {
                toast.success(data.message);

                // Clear all fields after successful submission
                setName('');
                setEmail('');
                setPassword('');
                setExperience('');
            } else {
                console.log(data);
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        } finally {
            setLoading(false); // Set loading to false after the form is submitted
        }
    };


    return (
        <form onSubmit={onSubmitHandler} className="w-full h-screen">

            <div className="max-w-[500px] flex flex-col gap-3">
                <div className="flex-1 flex flex-col gap-1">
                    <p>Employee Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} className="border-2 rounded px-3 py-2 bg-transparent border-secondary" type="text" placeholder="Enter your name" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Employee Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="border-2 rounded px-3 py-2 bg-transparent border-secondary" type="email" placeholder="Enter your email" required />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Employee Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} className="border-2 rounded px-3 py-2 bg-transparent border-secondary"
                        type="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <p>Experience</p>
                    <select onChange={(e) => setExperience(e.target.value)} value={experience} className="border-2 rounded px-3 py-2 bg-transparent border-secondary text-gray-400" required name="" id="">
                        <option value="">Select Experience</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Year">2 Years</option>
                        <option value="3 Year">3 Years</option>
                        <option value="4 Year">4 Years</option>
                        <option value="5 Year">5 Years</option>
                        <option value="6 Year">6 Years</option>
                        <option value="7 Year">7 Years</option>
                        <option value="8 Year">8 Years</option>
                        <option value="9 Year">9 Years</option>
                        <option value="10 Year">10 Years</option>
                        <option value="10 Year">10+ Years</option>
                    </select>
                </div>

                <div>
                    <button type="submit" className="bg-primary text-white px-10 py-3 rounded-full mt-4 flex items-center justify-center" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                                </svg>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            "Add Employee"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddEmployee;
