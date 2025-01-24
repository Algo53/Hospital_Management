import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getDoctorInfoRoute, selectDoctorInfo } from '../../redux/slices/DoctorInfoSlice';
import { getAllAppointmentRoute, selectAllAppointments } from '../../redux/slices/AppointmentInfoSlice';
import AppointementList from '../../components/AppointementList';
import { selectRole } from '../../redux/slices/UserInfoSlice';
import DoctorStatistics from '../../components/DoctorStatistics';

function DoctorDashboard() {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectRole);
  const doctorInfo = useAppSelector(selectDoctorInfo);
  const allAppointments = useAppSelector(selectAllAppointments);

  const [todayAppointments, setTodayAppointment] = useState<IAppointment[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    const todayAppointmentList = allAppointments.filter(appointment => {
      const date = new Date(appointment.scheduledDate);
      const today = new Date();
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    });
    const sortedTodayAppointments = todayAppointmentList.sort((a, b) => {
      const dateA = new Date(a.scheduledDate);
      const dateB = new Date(b.scheduledDate);
      return dateA.getTime() - dateB.getTime(); // Ascending order
    });

    setTodayAppointment(sortedTodayAppointments);
    const completedAppointmentList = allAppointments.filter(appointment => {
      return appointment.status === "Completed";
    });
    setCompletedAppointments(completedAppointmentList);
  }, [allAppointments])

  useEffect(() => {
    if (!doctorInfo) dispatch(getDoctorInfoRoute());
    dispatch(getAllAppointmentRoute());
  }, []);

  return (
    <div className='flex w-full h-full'>
      <div className='flex flex-col gap-3 w-full h-full overflow-y-scroll hide-scrollbar'>
        <div className='flex-grow grid grid-cols-1 lg:grid-cols-2 gap-3 w-full'>
          <div className='flex flex-col flex-grow gap-3 bg-white rounded-lg hover:shadow-2xl p-3'>
            <div className='flex w-max bg-gradient-to-r from-black/40 to-black/90 text-white p-1 rounded-md text-md xss:text-lg xs:text-xl font-bold'>Today's Appoinements</div>
            <div className='flex flex-col w-full gap-1 border-2 border-slate-400 rounded-xl pb-2 h-60'>
              <div className='flex w-full p-3 justify-between'>
                <div className='flex w-5/12'>{userRole === "Doctor" ? "Patient Name" : "Doctor Name"}</div>
                <div className='flex w-3/12'>Date</div>
                <div className='flex w-1/12'>Time</div>
                <div className='flex w-3/12 justify-end'>Reason</div>
              </div>
              <div className='flex h-[1px] bg-black w-full'></div>
              {
                todayAppointments.length > 0 ? (
                  <div className='flex w-full h-full px-2 overflow-y-scroll hide-scrollbar px-2'>
                    <AppointementList data={todayAppointments} />
                  </div>
                ) : (
                  <div className='flex w-full h-full items-center justify-center lg:text-5xl md:text-3xl text-2xl'>
                    <div className='flex w-min'>No Today's Appointments</div>
                  </div>
                )
              }
            </div>
          </div>
          <div className='flex flex-col gap-3 bg-white rounded-lg hover:shadow-2xl p-3'>
            <div className='flex w-max h-min text-md xss:text-lg xs:text-xl font-bold bg-gradient-to-r from-green-300 to-green-700 p-1 rounded-md'>Completed Appoinements</div>
            <div className='flex flex-col w-full h-full gap-1 border-2 border-slate-400 rounded-xl pb-2 h-60'>
              <div className='flex w-full h-1/12 p-3 justify-between'>
                <div className='flex w-5/12'>{userRole === "Doctor" ? "Patient Name" : "Doctor Name"}</div>
                <div className='flex w-3/12'>Date</div>
                <div className='flex w-1/12'>Time</div>
                <div className='flex w-3/12 justify-end'>Reason</div>
              </div>
              <div className='flex h-[1px] bg-black w-full'></div>
              {
                completedAppointments.length > 0 ? (
                  <div className='flex w-full h-10/12 overflow-y-scroll hide-scrollbar px-2'>
                    <AppointementList data={completedAppointments} />
                  </div>
                ) : (
                  <div className='flex w-full h-full items-center justify-center lg:text-5xl md:text-3xl text-2xl'>
                    <div className='flex w-min'>No Completed Appointments</div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className='flex-grow grid grid-cols-1 lg:grid-cols-2 gap-3 w-full pb-3'>
          <div className='flex flex-col gap-3 bg-white rounded-lg hover:shadow-2xl p-3'>
            <div className='flex w-max h-min text-md xss:text-lg xs:text-xl font-bold bg-gradient-to-r from-blue-300 to-blue-700 p-1 rounded-md'>All Appoinements</div>
            <div className='flex flex-col w-full gap-1 border-2 border-slate-400 rounded-xl pb-2 h-60'>
              <div className='flex w-full p-3 justify-between'>
                <div className='flex w-5/12'>{userRole === "Doctor" ? "Patient Name" : "Doctor Name"}</div>
                <div className='flex w-3/12'>Date</div>
                <div className='flex w-1/12'>Time</div>
                <div className='flex w-3/12 justify-end'>Reason</div>
              </div>
              <div className='flex h-[1px] bg-black w-full'></div>
              {
                allAppointments.length > 0 ? (
                  <div className='flex w-full h-full overflow-y-scroll hide-scrollbar px-2'>
                    <AppointementList data={allAppointments} />
                  </div>
                ) : (
                  <div className='flex w-full h-full items-center justify-center lg:text-5xl md:text-3xl text-2xl'>
                    <div className='flex w-min'>No Appointments</div>
                  </div>
                )
              }
            </div>
          </div>
          <div className='flex flex-col flex-grow gap-3 bg-white rounded-lg hover:shadow-2xl p-3'>
            <div className='flex w-max bg-gradient-to-r from-red-400 to-red-900 text-white p-1 rounded-md text-md xss:text-lg xs:text-xl font-bold'>Statistics of appoinements</div>
            <div className='flex flex-col w-full pb-2 h-60'>
              <DoctorStatistics appointments={allAppointments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard