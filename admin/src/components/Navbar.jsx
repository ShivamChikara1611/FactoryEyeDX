import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext';
import { EmployeeContext } from '../context/EmployeeContext';
import FactoryIcon from '@mui/icons-material/Factory';

const Navbar = () => {

  const { aToken, setAToken } = useContext(AdminContext);
  const { eToken, setEToken } = useContext(EmployeeContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate('/');

    aToken && setAToken("");
    aToken && localStorage.removeItem('aToken');

    eToken && setEToken("");
    eToken && localStorage.removeItem('eToken');
  }


  return (
    <div className='bg-primary mx-[50px] lg:mx-[300px] my-5 rounded-full flex justify-between items-center text-white py-3 px-[50px]'>
      <div className='flex items-center justify-between gap-8'>
        <div className='flex items-center justify-between text-md font-bold gap-1'>
          <FactoryIcon />
          <h6 className=''>FactoryEyeDX</h6>
        </div>
        <p className='border-2 border-white/90 text-white/90 text-xs px-3 py-1 rounded-full'>{aToken ? 'Admin' : 'Employee'}</p>
      </div>

      <button onClick={logout} className='border-2 border-white/90 bg-white/90 px-3 py-1 rounded-full text-primary text-xs'>Logout</button>
    </div>
  )
}

export default Navbar