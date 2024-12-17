import React, { useEffect } from 'react'
import List from '../components/List'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { nurseOptions } from '../helper/listVariables';
import { getAllNurseInfoRoute, selectAllNurses } from '../redux/slices/NurseInfoSlice';
import { selectShowUserId } from '../redux/slices/UserInfoSlice';
import ShowUserDetails from '../components/ShowUserDetails';

function NurseList() {
  const dispatch = useAppDispatch();
  const showUserId = useAppSelector(selectShowUserId);
  const nurseData = useAppSelector(selectAllNurses);

  useEffect(() => {
    dispatch(getAllNurseInfoRoute());
  }, [])

  return (
    <div className='flex flex-col gap-3 w-full h-full pb-5'>
      <div className='flex text-2xl font-bold'>Staff</div>
      <div className='flex flex-col w-full h-full gap-1 border-2 border-slate-400 rounded-xl pb-2'>
        <div className='flex w-full h-1/12 p-3'>
          {
            nurseOptions.map((item, index) => (
              <div
                key={index}
                className={`${index === nurseOptions.length - 2 ? "lg:flex hidden" : index === nurseOptions.length - 3 ? "md:flex hidden": index === nurseOptions.length - 4 ? "sm:flex hidden": "flex"} lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 ${index === 0 ? "justify-start" : item === nurseOptions[nurseOptions.length - 1] ? "justify-end" : "justify-center"}`}
              >{item}</div>
            ))
          }
        </div>
        <div className='flex h-[1px] bg-black w-full'></div>
        <div className='flex w-full h-10/12 overflow-y-scroll hide-scrollbar px-2'>
          {
            nurseData && nurseData.length > 0 ? (
              <List type="Nurse" data={nurseData} />
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <div className='text-xl md:text-3xl lg:text-5xl'>No Staff</div>
              </div>
            )
          }
        </div>
      </div>
      {showUserId && (
        <div
          className='absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='xl:w-1/2 sm:w-3/4 w-full h-3/4 bg-slate-200 p-[3px] rounded-2xl flex justify-center items-center hover:shadow-2xl'>
            <ShowUserDetails />
          </div>
        </div>
      )}
    </div>
  )
}

export default NurseList;