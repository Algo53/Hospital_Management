import { useEffect } from 'react'
import List from '../components/List'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { patientOptions } from '../helper/listVariables';
import { selectShowUserId } from '../redux/slices/UserInfoSlice';
import ShowUserDetails from '../components/ShowUserDetails';
import { getAllPatientInfoRoute, selectAllPatients } from '../redux/slices/PatientInfoSlice';

function PatientList() {
  const showUserId = useAppSelector(selectShowUserId);
  const dispatch = useAppDispatch();
  const PatientData = useAppSelector(selectAllPatients);

  useEffect(() => {
    dispatch(getAllPatientInfoRoute());
  }, [])

  return (
    <div className='flex flex-col gap-3 w-full h-full pb-5'>
      <div className='flex text-2xl font-bold'>Patients</div>
      <div className='flex flex-col w-full h-full gap-1 border-2 border-slate-400 rounded-xl pb-2'>
        <div className='flex w-full h-1/12 p-3'>
          {
            patientOptions.map((item, index) => (
              <div key={index} className={`${index === patientOptions.length - 2 ? "lg:flex hidden" : index === patientOptions.length - 3 ? "md:flex hidden" : index === patientOptions.length - 4 ? "sm:flex hidden" : "flex"} lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 ${index === 0 ? "justify-start" : index === patientOptions.length - 1 ? "justify-end" : "justify-center"}`}>{item}</div>
            ))
          }
        </div>
        <div className='flex h-[1px] bg-black w-full'></div>
        <div className='flex w-full h-10/12 overflow-y-scroll hide-scrollbar px-2'>
          {
            PatientData && PatientData.length > 0 ? (
              <List type="Patient" data={PatientData} />
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <div className='text-xl md:text-3xl lg:text-5xl'>No Patients</div>
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

export default PatientList