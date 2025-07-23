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

const Sidebar = () => {

  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(EmployeeContext);


  return (
    <div className='min-h-screen min-w-[50px] md:min-w-fit text-sm'>
      {
        aToken && <ul className='text-primary flex flex-col gap-3'>
          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/'>
            <DashboardIcon />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/all-employees'>
            <GroupsIcon />
            <p className='hidden md:block'>All Employees</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/add-employee'>
            <PersonAddAltIcon />
            <p className='hidden md:block'>Add Employee</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/sensors'>
            <SensorsIcon />
            <p className='hidden md:block'>All Sensors</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/issues'>
            <WarningIcon />
            <p className='hidden md:block'>All Issues</p>
          </NavLink>

          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/assign-task'>
            <AddTaskIcon />
            <p className='hidden md:block'>Assign Task</p>
          </NavLink>

        </ul>
      }

      {
        dToken && <ul className='text-primary flex flex-col gap-3'>
          <NavLink className={({ isActive }) => `flex border-2 border-primary items-center gap-2 rounded-r-full w-fit p-3 md:w-[200px] cursor-pointer ${isActive ? 'bg-primary text-white/90 border-l-0 md:mr-4' : 'border-2 border-r-0 rounded-l-full rounded-r-none md:ml-4'}`} to='/'>
            <DashboardIcon />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>
        </ul>
      }

    </div>
  )
}

export default Sidebar