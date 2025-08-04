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
    <div className='bg-main w-full mx-[25%] flex justify-between px-10 py-3 rounded-full text-sm mb-5 text-white'>
      <div className='flex gap-8 items-center'>
        <div className='font-semibold italic text-xl'>
          <h6>FactoryEyeDX</h6>
        </div>
        <p className='text-xs border px-3 py-1 rounded-full'>{aToken ? 'Admin' : 'Employee'}</p>
      </div>

      <button onClick={logout} className='border bg-transparent px-5 py-1 rounded-full font-semibold hover:text-main hover:bg-primary duration-200 ease-in'>Logout</button>
    </div>
  )
}

export default Navbar