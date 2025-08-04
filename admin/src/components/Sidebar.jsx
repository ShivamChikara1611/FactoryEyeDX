import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext';
import { EmployeeContext } from '../context/EmployeeContext';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import SensorsIcon from '@mui/icons-material/Sensors';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import WarningIcon from '@mui/icons-material/Warning';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Sidebar = () => {

  const { aToken } = useContext(AdminContext);
  const { eToken } = useContext(EmployeeContext);


  return (
    <div>
      {
        aToken && <ul className='text-white font-semibold flex flex-col gap-3 cursor-pointer'>
          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/'>
            <DashboardIcon />
            <p>Dashboard</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/all-employees'>
            <GroupsIcon />
            <p>All Employees</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/add-employee'>
            <PersonAddAltIcon />
            <p>Add Employee</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/sensors'>
            <SensorsIcon />
            <p>All Sensors</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/issues'>
            <WarningIcon />
            <p>All Issues</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex items-center gap-1 pl-3 py-3 rounded-lg ${isActive ? 'bg-main' : 'bg-primary text-main'}`} to='/assign-task'>
            <AddTaskIcon />
            <p>Assign Task</p>
          </NavLink>

        </ul>
      }

      {
        eToken && <ul className='text-primary flex flex-col gap-3'>
          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/'>
            <DashboardIcon />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/profile'>
            <AccountBoxIcon />
            <p className='hidden md:block'>Profile</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/all-tasks'>
            <TaskAltIcon />
            <p className='hidden md:block'>All Tasks</p>
          </NavLink>
        </ul>
      }

    </div>
  )
}

export default Sidebar