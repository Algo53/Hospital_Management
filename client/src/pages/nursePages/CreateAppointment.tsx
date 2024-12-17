import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getAllDoctorInfoRoute, getDoctorAssignedSlots, selectAllDoctors, selectDoctorSlots } from '../../redux/slices/DoctorInfoSlice';
import { useNavigate } from 'react-router-dom';
import { findPatientDetailsRoute, resetPatientInfo, resetPatientState, resetPatientStatus, selectPatientInfo, selectPatientStatus, updatePatientDetailsRoute } from '../../redux/slices/PatientInfoSlice';
import { toast, ToastContainer } from 'react-toastify';
import { calculateAge } from '../../helper/calculateAge';
import { selectNurseInfo } from '../../redux/slices/NurseInfoSlice';
import { generateDateStrings, generateSlots } from '../../helper/generateSlots';
import { addAppointmentRoute, resetAppointmentStatus, selectAppointmentStatus } from '../../redux/slices/AppointmentInfoSlice';

interface IDoctorInfo {
    id: IdType,
    name: string,
}

interface IAppointment {
    patientId: string,
    doctorId: string,
    reasoneForAppointment: string,
    scheduledDate: string,
}

function CreateAppointment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const nurseInfo = useAppSelector(selectNurseInfo);
    const doctorAssignedSlots = useAppSelector(selectDoctorSlots);
    const allDoctors = useAppSelector(selectAllDoctors);
    const patientStatus = useAppSelector(selectPatientStatus);
    const appointmentStatus = useAppSelector(selectAppointmentStatus);
    const patientDetails = useAppSelector(selectPatientInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [patientDataEdit, setEdit] = useState<boolean>(false);
    const [patientData, setPatientData] = useState<any>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        bloodGroup: "",
        bloodPressure: "",
        height: 0,
        weight: 0,
    });
    const [appointment, setAppointment] = useState<IAppointment>({
        patientId: "",
        doctorId: "",
        reasoneForAppointment: "",
        scheduledDate: ''
    })
    const [doctorData, setDoctorData] = useState<IDoctor | null>(null)
    const [doctorList, setDoctorList] = useState<IDoctorInfo[] | null>(null);

    const [bookedSlots, setBookedSlot] = useState<{ value: string; data: string }[] | null>(null);
    const [slots, setSlots] = useState<string[] | null>(null);
    const [dates, setDates] = useState<{ value: string; data: string }[] | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    }

    const handlePatientDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    }

    const handleUserSearch = () => {
        dispatch(resetPatientInfo());
        setLoading(true);
        dispatch(findPatientDetailsRoute({ patientId: appointment.patientId }));
    }

    const handleBack = () => {
        dispatch(resetPatientInfo());
        navigate(-1);
    }

    const handleUpdatePatient = () => {
        dispatch(resetPatientStatus());
        setUpdateLoading(true);
        const data = {
            bloodGroup: patientData.bloodGroup,
            bloodPressure: patientData.bloodPressure,
            height: patientData.height,
            weight: patientData.weight,
        }
        dispatch(updatePatientDetailsRoute({ patientId: patientDetails?._id, patientData: data }));
    }

    const handleDoctorSchedule = () => {
        if (allDoctors) {
            const data = allDoctors.filter((item) => item._id === appointment.doctorId);
            setDoctorData(data[0]);

            dispatch(getDoctorAssignedSlots({ doctorId: data[0]._id }));

            const result = generateSlots(data[0].availableSlots);
            setSlots(result);

            const dates = generateDateStrings();
            setDates(dates);
        }
    }

    const handleBookAppointment = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(resetAppointmentStatus());
        const data = {
            patientId: patientDetails?._id,
            doctorId: appointment.doctorId,
            scheduledDate: selectDate + ',' + time,
            reasoneForAppointment: appointment.reasoneForAppointment,
        }
        setLoading(true);
        dispatch(addAppointmentRoute(data));
    }

    useEffect(() => {
        if (allDoctors && nurseInfo) {
            const result = allDoctors.map((item: any) => {
                return (
                    {
                        id: item._id,
                        name: item.userId.firstName + " " + item.userId.lastName
                    }
                )
            })
            const data = result.filter((item) => (item.id === nurseInfo.assignedDoctor));
            setDoctorList(data);
        }
    }, [allDoctors, nurseInfo])

    useEffect(() => {
        if (loading) {
            if (patientStatus === 'idle') {
                setLoading(false);
            }
            else if (patientStatus === 'rejected') {
                setLoading(false);
                toast.error("No user found with this id", { autoClose: 3000 });
            }
        }
        if (updateLoading) {
            if (patientStatus === 'idle') {
                setUpdateLoading(false);
                setEdit(false);
                toast.success("Updated Patient data successfully", { autoClose: 3000 });
            }
            else if (patientStatus === 'rejected') {
                setUpdateLoading(false);
                toast.error("Failed to update patient details", { autoClose: 3000 });
            }
        }
    }, [patientStatus])

    useEffect(() => {
        if (loading) {
            if (appointmentStatus === 'idle') {
                setLoading(false);
                toast.success("Appointment is scheduled successfully", { autoClose: 3000 });
                setAppointment({
                    patientId: "",
                    doctorId: "",
                    reasoneForAppointment: "",
                    scheduledDate: ''
                });
                setPatientData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    dateOfBirth: "",
                    bloodGroup: "",
                    bloodPressure: "",
                    height: 0,
                    weight: 0,
                })
                setDoctorData(null);
                dispatch(resetPatientState());
                dispatch(getAllDoctorInfoRoute());
            }
            else if (appointmentStatus === 'rejected') {
                setLoading(false);
                toast.error("No user found with this id", { autoClose: 3000 });
            }
        }
    }, [appointmentStatus])

    useEffect(() => {
        if (patientDetails) {
            const data = {
                firstName: patientDetails?.userId.firstName,
                lastName: patientDetails?.userId.lastName,
                email: patientDetails?.userId.email,
                dateOfBirth: patientDetails?.userId.dateOfBirth,
                phone: patientDetails?.userId.phone,
                bloodGroup: patientDetails.bloodGroup,
                bloodPressure: patientDetails.bloodPressure,
                height: patientDetails.height,
                weight: patientDetails.weight,
            }
            setPatientData(data);
        }
    }, [patientDetails])

    useEffect(() => {
        if (doctorAssignedSlots) setBookedSlot(doctorAssignedSlots);
    }, [doctorAssignedSlots])

    useEffect(() => {
        dispatch(getAllDoctorInfoRoute());
    }, [])

    return (
        <div className='flex flex-col gap-3 w-full h-max-screen'>
            <ToastContainer position="top-right" />
            {/* Loading Overlay */}
            {(loading || updateLoading) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
            <div className='flex w-full text-xl font-bold'>Create Appointment</div>
            <div className='flex flex-col gap-3 flex-grow w-full'>
                <div className='flex flex-col w-full bg-white p-3 rounded-md gap-3 items-center'>
                    <div className='flex gap-4 w-full items-center sm:flex-row flex-col'>
                        <label className='text-sm sm:text-lg font-semibold' htmlFor='patientid'>Enter User Id or Gmail</label>
                        <input type='text' name='patientId' className="px-2 py-1 w-full md:w-1/3 border rounded-md hover:shadow-2xl" value={appointment.patientId} placeholder='Enter the user id or gmail...' onChange={handleChange} />
                        <button className={`p-1 border rounded-md bg-gradient-to-r from-black/30 to-black/90 hover:from-black/50 hover:to-black/100 text-white text-sm sm:text-lg`} onClick={handleUserSearch} disabled={appointment.patientId ? false : true}>Search</button>
                    </div>
                    <div className={`${patientDetails ? "flex" : "hidden"} w-full bg-gradient-to-r from-black/60 to-black/80 text-white rounded-md p-3 hover:shadow-2xl`}>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-3'>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl font-bold w-1/2'>First Name</div>
                                <div className='text-xs sm:text-md lg:text-lg font-semibold w-1/2 py-1 px-2 rounded-md bg-gray-400'>{patientData.firstName}</div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Last Name</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patientData.lastName}</div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Email Address</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patientData.email}</div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Phone Number</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{patientData.phone}</div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Age</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-gray-400'>{calculateAge(patientData.dateOfBirth)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${patientDetails ? "flex" : "hidden"} flex-col gap-3 w-full bg-gradient-to-r from-black/60 to-black/80 text-white rounded-md p-3 hover:shadow-2xl`}>
                        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-3'>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl font-bold w-1/2'>Blood Group</div>
                                <div className='text-xs sm:text-md lg:text-lg font-semibold w-1/2 py-1 px-2 rounded-md bg-white text-black'>
                                    {
                                        patientDataEdit ?
                                            (<input name='bloodGroup' value={patientData.bloodGroup} onChange={handlePatientDataChange} />)
                                            : <>{patientData.bloodGroup}</>
                                    }
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Blood Pressure</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-white text-black'>
                                    {
                                        patientDataEdit ? (
                                            <input name='bloodPressure' value={patientData.bloodPressure} onChange={handlePatientDataChange} />
                                        ) : (
                                            <>{patientData.bloodPressure === "" ? "N/A" : patientData.bloodPressure}</>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Height</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-white text-black'>
                                    {
                                        patientDataEdit ? (
                                            <input name='height' value={patientData.height} onChange={handlePatientDataChange} />
                                        ) : (
                                            <>{patientData.height}</>
                                        )
                                    }
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <div className='text-sm sm:text-lg lg:text-xl w-1/2 font-bold'>Weight</div>
                                <div className='text-xs sm:text-md lg:text-lg w-1/2 font-semibold py-1 px-2 rounded-md bg-white text-black'>
                                    {
                                        patientDataEdit ? (
                                            <input name='weight' value={patientData.weight} onChange={handlePatientDataChange} />
                                        ) : (
                                            <>{patientData.weight}</>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={`flex w-full ${patientDataEdit ? "justify-between" : "justify-end"}`}>
                            <button className={`${patientDataEdit ? "hidden" : "flex"} text-xl py-1 px-3 rounded-md border bg-gradient-to-r from-gray-400 to-gray-800 hover:from-gray-600 hover:to-gray-900`} onClick={() => (setEdit(true))}>Edit</button>
                            <button className={`${patientDataEdit ? "flex" : "hidden"} text-xl py-1 px-3 rounded-md border bg-gradient-to-r from-gray-400 to-gray-800 hover:from-gray-600 hover:to-gray-900`} onClick={() => (setEdit(false))}>Cancel</button>
                            <button className={`${patientDataEdit ? "flex" : "hidden"} text-xl py-1 px-3 rounded-md border bg-gradient-to-r from-blue-400 to-blue-800 hover:from-blue-600 hover:to-blue-900`} onClick={handleUpdatePatient}>Update</button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full bg-white p-3 rounded-md items-center gap-3'>
                    <div className='flex gap-3 w-full items-center sm:flex-row flex-col'>
                        <label htmlFor='doctorId' className='text-sm sm:text-lg font-semibold'>Select the Doctor</label>
                        <select name='doctorId' value={appointment.doctorId} onChange={handleChange} className="px-2 py-1 border rounded-md hover:shadow-2xl" >
                            <option value="">Select the Doctor</option>
                            {
                                doctorList && doctorList.map((item, index) => (
                                    <option key={index} value={String(item.id)}>{item.name}</option>
                                ))
                            }
                        </select>
                        <button disabled={appointment.doctorId === ""} className='flex border py-1 px-2 rounded-md bg-gradient-to-r from-black/30 to-black/90 hover:from-black/50 hover:to-black/100 text-white text-sm sm:text-lg' onClick={handleDoctorSchedule}>Find Schedule</button>
                    </div>
                    <div className={`${doctorData ? "flex" : "hidden"} flex-col gap-4 w-full bg-gradient-to-r from-black/60 to-black/80 text-white rounded-md p-3 hover:shadow-2xl`}>
                        <div className='flex px-2 w-full justify-center gap-4 overflow-x-scroll hide-scrollbar'>
                            {
                                dates?.map((item, index) => {
                                    return (
                                        <div key={index} className={`flex cursor-pointer py-3 px-2 border rounded-lg ${selectDate === item.value ? "text-black bg-gradient-to-r from-white/50 to-white" : ""}`}
                                            onClick={() => {
                                                if (selectDate) {
                                                    if (selectDate === item.value) setSelectDate(null);
                                                    else setSelectDate(item.value);
                                                } else {
                                                    setSelectDate(item.value);
                                                }
                                            }}
                                        >
                                            {item.data}
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                        <div className='flex px-2 w-full gap-4 overflow-x-scroll hide-scrollbar'>
                            {
                                slots?.map((item, index) => {
                                    const isAssigned = bookedSlots?.some(
                                        (slote) => slote.value === selectDate && slote.data === item
                                    );
                                    return (
                                        <div key={index} className={`flex items-center gap-2 text-black py-1 px-2 rounded-md ${isAssigned ? "bg-red-500 text-white cursor-not-allowed" : time === item ? "bg-gradient-to-r from-blue-300 to-blue-800 hover:from-blue-500 hover:to-blue-900 text-white cursor-pointer" : "bg-white cursor-pointer"}`}
                                            onClick={() => {
                                                if (!isAssigned) {
                                                    if (time) {
                                                        if (time === item) setTime(null);
                                                        else setTime(item);
                                                    } else {
                                                        setTime(item);
                                                    }
                                                }
                                            }}
                                        >
                                            {item}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='flex flex-col w-full bg-white p-3 rounded-md gap-3 items-center'>
                    <label htmlFor='reasoneForAppointment' className='text-lg font-semibold justify-start w-full'>Reason for the appointment</label>
                    <textarea name="reasoneForAppointment" value={appointment.reasoneForAppointment} onChange={handleChange} cols={4} className='p-2 border rounded-md w-full' />
                </div>
                <div className='flex w-full justify-between pb-3'>
                    <button className='py-1 px-2 rounded-md text-lg bg-red-500 hover:bg-red-700 text-white hover:shadow-2xl' onClick={handleBack}>Cancel</button>
                    <button className='py-1 px-2 rounded-md text-lg bg-gradient-to-r from-blue-300 to-blue-700 hover:from-blue-500 hover:to-blue-900 font-semibold hover:shadow-2xl' onClick={handleBookAppointment}>Book Appointment</button>
                </div>
            </div>
        </div>
    )
}

export default CreateAppointment;