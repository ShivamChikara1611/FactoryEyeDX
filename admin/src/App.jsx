import React, { useContext } from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext.jsx';
import { EmployeeContext } from './context/EmployeeContext.jsx';
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx';
import ADashboard from './pages/Admin/ADashboard.jsx';
import EDashboard from './pages/Employee/EDashboard.jsx'
import AllEmployees from './pages/Admin/AllEmployees.jsx';
import AddEmployee from './pages/Admin/AddEmployee.jsx';
import AllSensors from './pages/Admin/AllSensors.jsx';
import AllIssues from './pages/Admin/AllIssues.jsx';
import AssignTask from './pages/Admin/AssignTask.jsx';
import Profile from './pages/Employee/Profile.jsx';
import Tasks from './pages/Employee/Tasks.jsx';


const App = () => {
  const { aToken } = useContext(AdminContext);
  const { eToken } = useContext(EmployeeContext);

  return aToken ? (
    <div className='relative h-screen bg-primary w-full'>
      <ToastContainer />
      <div className='fixed top-5 left-0 right-0 w-full flex justify-center'>
        <Navbar />
      </div>
      <div className='flex h-full'>
        <div className='w-[280px] px-3 py-10 top-0 left-0 bg-main'>
          <Sidebar />
        </div>
        <div className='w-full mt-[90px] mx-5 h-[86vh]'>
          <Routes>
            <Route path='/' element={<ADashboard />} />
            <Route path='/all-employees' element={<AllEmployees />} />
            <Route path='/add-employee' element={<AddEmployee />} />
            <Route path='/sensors' element={<AllSensors />} />
            <Route path='/issues' element={<AllIssues />} />
            <Route path='/assign-task' element={<AssignTask />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : eToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start md:gap-8'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<EDashboard />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/all-tasks' element={<Tasks />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App