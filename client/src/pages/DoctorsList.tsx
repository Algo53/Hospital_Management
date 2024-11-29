import React, { useEffect } from 'react'
import List from '../components/List'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { getAllDoctorInfoRoute, selectAllDoctors } from '../redux/slices/DoctorInfoSlice'
import { doctorOptions } from '../helper/listVariables';

function DoctorsList() {
  const dispatch = useAppDispatch();
  const DoctorsData = useAppSelector(selectAllDoctors);

  useEffect(() => {
    dispatch(getAllDoctorInfoRoute());
  }, [])

  return (
    <div className='flex flex-col gap-3 w-full h-full pb-5'>
      <div className='flex text-2xl font-bold'>Doctors</div>
      <div className='flex flex-col w-full h-full gap-1 border-2 border-slate-400 rounded-xl pb-2'>
        <div className='flex w-full h-1/12 p-3'>
          {
            doctorOptions.map((item, index) => (
              <div key={index} className={`${index === doctorOptions.length - 2 ? "lg:flex hidden" : index === doctorOptions.length - 3 ? "md:flex hidden": index === doctorOptions.length - 4 ? "sm:flex hidden": "flex"} lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 ${index === 0 ? "justify-start" : index === doctorOptions.length - 1 ? "justify-end" : "justify-center"}`}>{item}</div>
            ))
          }
        </div>
        <div className='flex h-[1px] bg-black w-full'></div>
        <div className='flex w-full h-10/12 overflow-y-scroll hide-scrollbar px-2'>
          <List type="Doctor" data={DoctorsData} />
        </div>
      </div>
    </div>
  )
}

export default DoctorsList