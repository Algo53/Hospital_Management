import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { removeAppointmentId, selectAppointmentId, selectAppointmentInfo } from "../redux/slices/AppointmentInfoSlice";
import { useEffect, useState } from "react";
import { calculateAge } from "../helper/calculateAge";
import { selectRole } from "../redux/slices/UserInfoSlice";
import { selectDoctorStatus, updateAppointment } from "../redux/slices/DoctorInfoSlice";
import { toast, ToastContainer } from "react-toastify";

function ShowAppointment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userRole = useAppSelector(selectRole);
    const status = useAppSelector(selectDoctorStatus);
    const appointmentId = useAppSelector(selectAppointmentId);
    const appointmentInfo = useAppSelector(selectAppointmentInfo);
    const [patinetInfo, setPatientInfo] = useState<any>(null);
    const [solution, setSolution] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(Number(e.target.value));
    };

    const handleUpdate = () => {
        console.log("Solution or cure for the problem is : ", solution);
        const data = {
            cureByDoctor: solution?.trim(),
            progress: progress
        }
        if (data.cureByDoctor && appointmentId) {
            setLoading(true);
            dispatch(updateAppointment({ appointmentId: appointmentId, data }));
        }
    }

    useEffect(() => {
        if (loading) {
            if (status === 'idle') {
                toast.success("Updated Successfully", { autoClose: 3000 });
                setLoading(false);
                navigate(-1);
            }
            else if (status === 'rejected') {
                toast.error("Action Falied", { autoClose: 3000 });
                setLoading(false);
            }
        }
    }, [status])

    useEffect(() => {
        if (appointmentInfo) {
            setPatientInfo(appointmentInfo.patientId);
            setProgress(appointmentInfo.progress);
        }
    }, [])

    useEffect(() => {
        if (!appointmentId) {
            navigate(-1);
        }
    }, [appointmentId])

    return (
        <div className='flex flex-col gap-4 w-full h-full'>
            <ToastContainer position="top-right" />
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
            <h1 className="text-2xl font-bold w-full justify-center">Appointment Page</h1>
            <div className="flex flex-col gap-3 w-full h-full rounded-2xl bg-white p-3 hover:shadow-2xl overflow-y-scroll hide-scrollbar">
                <div className="flex flex-grow flex-col gap-2 w-full">
                    <div className="flex flex-col sm:flex-row w-full justify-between gap-4 items-center">
                        <img className="flex w-32 h-32 rounded-full hover:shadow-2xl" src={patinetInfo?.userId?.photo} alt="" />
                        <div className="flex w-full rounded-lg p-1 bg-gradient-to-r from-gray-200 to-gray-500">
                            <div className={`flex w-full bg-gradient-to-r from-black/60 to-black/80 text-white rounded-md p-4 hover:shadow-2xl`}>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-3'>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl font-bold w-1/2'>First Name</div>
                                        <div className='text-xs sm:text-md lg:text-lg font-semibold w-1/2 py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.userId.firstName}</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Last Name</div>
                                        <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.userId.lastName}</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Email Address</div>
                                        <div className='text-[10px] sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.userId.email}</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Phone Number</div>
                                        <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.userId.phone}</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Age</div>
                                        <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{calculateAge(patinetInfo?.userId.dateOfBirth)}</div>
                                    </div>
                                    <div className='flex items-center'>
                                        <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Gender</div>
                                        <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.userId.gender}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full rounded-lg p-1 bg-gradient-to-r from-gray-200 to-gray-500">
                        <div className={`flex w-full bg-gradient-to-r from-black/60 to-black/80 text-white rounded-md p-4 hover:shadow-2xl`}>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-3'>
                                <div className='flex items-center'>
                                    <div className='text-sm sm:text-lg lg:text-xl font-bold w-1/2'>Address</div>
                                    <div className='text-xs sm:text-md lg:text-lg font-semibold w-1/2 py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.address}</div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Height</div>
                                    <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.height}cm</div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Weight</div>
                                    <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.weight}kg</div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Blood Group</div>
                                    <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.bloodGroup}</div>
                                </div>
                                <div className='flex items-center'>
                                    <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Blood Pressure</div>
                                    <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patinetInfo?.bloodPressure}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-center bg-gradient-to-r from-gray-300 to-gray-700 p-2 rounded-lg gap-2">
                        <div className='text-sm sm:text-lg lg:text-xl font-bold w-full'>Reason For Appointement</div>
                        <div className='text-xs sm:text-md lg:text-lg font-semibold w-full py-1 px-2 rounded-md bg-gray-400'>{appointmentInfo?.reasoneForAppointment}</div>
                    </div>
                    <div className="flex flex-col w-full items-center bg-gradient-to-r from-gray-300 to-gray-700 p-2 rounded-lg gap-2">
                        <div className='text-sm sm:text-lg lg:text-xl font-bold w-full'>Previous Medical History</div>
                        <div className='text-xs sm:text-md lg:text-lg font-semibold w-full p-2 rounded-md bg-gray-400'>
                            {
                                appointmentInfo?.cureByDoctor && appointmentInfo?.cureByDoctor.length > 0 ? (
                                    <div className="flex gap-2 flex-col w-full h-20 overflow-y-scroll hide-scrollbar">
                                        {
                                            appointmentInfo?.cureByDoctor.map((item, index) => {
                                                const date = new Date(item.createdAt).toLocaleString();
                                                return (
                                                    <div key={index} className='font-semibold py-1 px-2 rounded-md bg-gray-400 bg-white/90 flex justify-between'>
                                                        <div className="text-md md:text-lg ">{item.data}</div>
                                                        <div className="flex text-xs md:text-md">{date}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                ) : (
                                    <div className='text-xs sm:text-md lg:text-lg font-semibold w-full py-1 px-2'> No Past recordes
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className={`${userRole === 'Doctor' && appointmentInfo?.status !== 'Completed' ? 'flex' : "hidden"} flex-col w-full items-center bg-gradient-to-r from-gray-300 to-gray-700 p-2 rounded-lg gap-2`}>
                        <div className='text-sm sm:text-lg lg:text-xl font-bold w-full'>Doctor Suggestions or Cure</div>
                        <textarea className='w-full py-1 px-2 rounded-md bg-white' cols={4} value={solution || ""} onChange={(e) => (setSolution(e.target.value))} />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <div className='text-sm sm:text-lg lg:text-xl font-bold w-full'>Appointment Progress</div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleProgressChange}
                            className="w-full cursor-pointer accent-blue-500"
                        />
                        <div className="text-center text-sm sm:text-base font-medium">
                            {progress}% Completed
                        </div>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between">
                    <button className="px-3 py-2 border rounded-lg bg-gradient-to-r from-gray-400 to-gray-900 text-white font-semibold hover:from-gray-200 hover:to-gray-500 hover:shadow-2xl" onClick={() => (dispatch(removeAppointmentId()))}>Back</button>
                    <button className={`${userRole === 'Doctor' ? "flex" : "hidden"} p-2 border rounded-lg bg-gradient-to-r from-blue-300 to-blue-800 text-white font-semibold hover:from-blue-200 hover:to-blue-500 hover:shadow-2xl`} disabled={solution ? false : true} onClick={handleUpdate}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default ShowAppointment;