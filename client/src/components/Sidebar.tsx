import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store';
import { selectRole, setMenu, setMode } from '../redux/slices/UserInfoSlice';
import { adminUrls, doctorUrls, nurseUrls, patientUrls } from '../helper/urls';

function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectRole);
  const mode = useAppSelector((state: RootState) => state.userInfo.mode);
  const userInfo = useAppSelector((state: RootState) => state.userInfo.userInfo);
  const [urls, setUrls] = useState<null | { path: string, name: string }[]>(null);

  const [currentPath, setCurrentPath] = useState<string>('/');

  const handleMode = () => { dispatch(setMode()); }

  useEffect(() => {
    const lastSegment = location.pathname.split('/').filter(Boolean).pop();
    if (lastSegment === userInfo?._id) {
      setCurrentPath('')
    }
    else if (lastSegment === 'completed') {
      setCurrentPath('completed');
    }
    else if (lastSegment === 'mytask') {
      setCurrentPath('mytask');
    }
    else if (lastSegment === 'pending') {
      setCurrentPath('pending');
    }
    else if (lastSegment === 'add') {
      setCurrentPath('add');
    }
    else if (lastSegment === 'profile') {
      setCurrentPath('profile');
    }
    else {
      setCurrentPath(lastSegment || '/')
    }
  }, [location])

  useEffect(() => {
    if (role === 'Admin') setUrls(adminUrls);
    else if (role === 'Doctor') setUrls(doctorUrls);
    else if (role === 'Nurse') setUrls(nurseUrls);
    else if (role === 'Patient') setUrls(patientUrls);
  }, [])

  return (
    <div className='flex w-full h-screen xl:p-3'>
      <div className='flex flex-col w-full h-full shadow-lg hover:shadow-xl bg-gradient-to-r from-teal-400 to-blue-500 xl:rounded-r-xl gap-4 p-4'>
        <div className='flex pt-3 px-2 text-4xl font-bold w-full justify-between items-center'>
          <div className='flex text-white'>{userInfo?.companyName}</div>
          <div className='flex gap-3'>
            <div className='flex hover:bg-black/20 rounded-full py-1 px-2'>
              {
                mode === 'light' ?
                  <i className="fa-regular fa-moon fa-md cursor-pointer text-white" onClick={handleMode} />
                  :
                  <i className="fa-solid fa-moon fa-md cursor-pointer text-white" onClick={handleMode} />
              }
            </div>
            <div className={`flex p-1 rounded-lg hover:bg-black/10 cursor-pointer`} onClick={() => dispatch(setMenu())}><i className="fa-solid fa-square-caret-left fa-md" /></div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-2'>
          <div className='flex w-full text-zinc-400 text-lg font-semibold'>General</div>
          <div className='flex flex-col w-full gap-3 text-xl'>
            {
              urls && urls.map((url, index) => (
                <Link key={index} to={url.path} className={`flex w-full pl-2 py-2 rounded-lg hover:bg-zinc-400 cursor-pointer items-center ${currentPath === url.path ? "bg-zinc-100 font-bold shadow-inner text-black" : "font-semibold text-white"}`} onClick={() => dispatch(setMenu())}>
                  {url.name}
                </Link>
              ))
            }
          </div>
        </div>
        <div className='flex items-end h-full w-full pb-4'>
          <Link to='profile' className={`flex w-full pl-2 py-3 text-3xl rounded-lg hover:bg-zinc-400 cursor-pointer items-center ${currentPath === 'profile' ? "bg-zinc-100 font-bold shadow-inner text-black" : "font-semibold text-white"}`} onClick={() => dispatch(setMenu())}>
            {
              userInfo?.photo ? <img src={userInfo.photo} alt="profile" className='w-12 h-12 rounded-full object' />
                : <i className="fa-solid fa-user fa-lg pr-5 pl-2" />
            }
            <div className='flex pl-2'>{userInfo?.firstName ? userInfo?.firstName : "Profile"}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;