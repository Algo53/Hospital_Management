import { selectAppointmentId, setAppointmentId, setAppointmentInfo } from "../redux/slices/AppointmentInfoSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";

function AppointementList({ data }: { data: IAppointment[] }) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const appointmentId = useAppSelector(selectAppointmentId);

    return (
        <div className='flex flex-col w-full gap-2'>
            {
                data.map((item: any, index: number) => {
                    const [date, time] = item.scheduledDate.split(',');
                    return (
                        <div key={index} className='flex w-full p-2 items-center bg-slate-100 rounded-lg hover:shadow-2xl cursor-pointer'
                            onClick={() => {
                                dispatch(setAppointmentId(item._id));
                                dispatch(setAppointmentInfo(item));
                                navigate(`appointment/${item._id}`);
                            }}
                        >
                            <div className='flex gap-2 w-5/12 items-center'>
                                {
                                    item.patientId.userId.photo ? (
                                        <img src={item.patientId.userId.photo} alt='' className='w-12 h-12 rounded-full' />
                                    ) : (
                                        <div className='flex w-12 h-12 rounded-full border'>
                                            <i className='fa-solid fa-user fa-2xl' />
                                        </div>
                                    )
                                }
                                <div className='flex text-sm font-semibold'>{item.patientId.userId.firstName} {item.patientId.userId.lastName}</div>
                            </div>
                            <div className='flex w-3/12'>{date}</div>
                            <div className='flex w-1/12'>{time}</div>
                            <div className='flex w-3/12 justify-end'>{item.reasoneForAppointment.slice(0, 20)}</div>
                        </div>
                    )
                })

            }
        </div>
    )
}

export default AppointementList;