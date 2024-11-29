import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAppSelector } from '../redux/store';
import { selectMenu, selectUser } from '../redux/slices/UserInfoSlice';

export default function UserLayout() {
  const navigate = useNavigate();
  const menu = useAppSelector(selectMenu);
  const userOnline = useAppSelector(selectUser);
  
  useEffect(() => {
    if (userOnline === false) {
      navigate('/login');
    }
  }, [userOnline])

  return (
    <div className={`flex w-full max-h-screen min-h-screen bg-zinc-100`}>
      <div className={`${menu ? "xl:flex hidden" : "hidden"} h-full xl:w-3/12`}>
        <Sidebar />
      </div>
      <div className={`${menu ? "xl:w-9/12 w-full xl:pt-4" : "w-full px-3"} flex-col flex max-h-screen min-h-screen`}>
        {menu && (
          <div className={`absolute top-0 left-0 lg:w-4/12 md:w-5/12 sm:w-6/12 xs:w-8/12 w-full max-h-screen min-h-screen bg-white xl:hidden shadow-lg z-50`}>
            <Sidebar />
          </div>
        )}
        <div className={`${menu ? "xl:rounded-md rounded-b-md" : "rounded-b-md"} flex w-full h-1/12 bg-blue-200 shadow-md `}>
          <Navbar />
        </div>
        <div className='flex h-full w-full p-3 bg-zinc-200 overflow-y-scroll hide-scrollbar'><Outlet /></div>
      </div>
    </div>
  )
}
