import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store';
import { removeUserId, selectRole, selectShowUserDetails } from '../redux/slices/UserInfoSlice';
import { assignNurseToDoctor } from '../redux/slices/DoctorInfoSlice';

function ShowUserDetails() {
    const dispatch = useAppDispatch();
    const userRole = useAppSelector(selectRole);
    const showUserInfo = useAppSelector(selectShowUserDetails);
    const [personalInfo, setpersonalInfo] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);

    const handleAssignNurseButton = () => {
        if (userData?._id) {
            dispatch(assignNurseToDoctor({nurseId: userData?._id}))
        }
    }

    useEffect(() => {
        if (showUserInfo) {
            setpersonalInfo(showUserInfo?.userInfo);
            setUserData(showUserInfo?.details[0]);
        }
    }, [showUserInfo]);

    return (
        <div className='flex flex-col w-full h-full rounded-2xl bg-white'>
            <div className='flex bg-gradient-to-r from-gray-300 to-gray-600 w-full rounded-t-2xl justify-between'>
                <div className='flex px-3 relative top-10'>
                    <div className='flex w-full h-full p-1 bg-white rounded-full items-center justify-center'>
                        <img className='w-32 h-32 rounded-full' src={personalInfo?.photo} alt="" />
                    </div>
                </div>
                <div className='flex p-3 items-end h-full'>
                    <div className='p-1 rounded-md border-1 bg-zinc-200 border-black text-lg font-semibold'>{personalInfo?.role}</div>
                </div>
            </div>
            <div className='flex flex-grow pt-5 flex-col gap-1 px-3 overflow-scroll hide-scrollbar'>
                <div className='flex justify-between items-center'>
                    <div className='flex flex-col'>
                        <div className='flex text-3xl font-bold'>{personalInfo?.firstName} {personalInfo?.lastName}</div>
                        <div className='flex text-xl font-semibold'>{personalInfo?.email}</div>
                    </div>
                    <div className={`${personalInfo?.role === 'Nurse' && userRole === "Doctor" ? "flex" : "hidden"} border-1 border-gray-600 p-1 rounded-md bg-gradient-to-r from-gray-200 to-gray-400`}>{userData?.assignedDoctor ? "Assigned" : "Open To Work"}</div>
                </div>
                <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                <div className='flex justify-between px-3 py-2'>
                    <div className='flex text-xl font-semibold'>Gender : {personalInfo?.gender}</div>
                    <div className='flex text-xl font-semibold'>Phone : {personalInfo?.phone}</div>
                </div>
                <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                {
                    personalInfo?.role === "Doctor" ? (
                        <>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Degree :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.degree.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Specialization :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.specialization.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Timings :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.availableSlots.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>

                        </>
                    ) : personalInfo?.role === "Nurse" ? (
                        <>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Degree :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.degree.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2 text-sm'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Specialization :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.specialization.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2 text-sm'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-bold'>Timings :</div>
                                <div className='flex text-lg gap-1'>
                                    {
                                        userData && userData?.shiftTimings.map((item: any, index: number) => (
                                            <div key={index} className='flex border-2 border-black rounded-lg py-1 px-2 text-sm'>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                        </>
                    ) : (
                        <>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-semibold'>BloodGroup :</div>
                                <div className='flex text-lg gap-1'>{userData?.bloodGroup}</div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-semibold'>Height :</div>
                                <div className='flex text-lg gap-1'>{userData?.height}cm</div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-semibold'>Weight :</div>
                                <div className='flex text-lg gap-1'>{userData?.weight}kg</div>
                            </div>
                            <div className='flex h-[2px] bg-zinc-200 w-full'></div>
                            <div className='flex gap-2 py-2 px-3 items-center'>
                                <div className='flex text-xl font-semibold'>No Of Appointments :</div>
                                <div className='flex text-lg gap-1'>{userData?.appointments.length}</div>
                            </div>
                        </>
                    )
                }
            </div>
            <div className='flex w-full justify-between pt-2 pb-3 px-3'>
                <button className='flex p-1 border-1 border-slate-200 rounded-lg bg-gradient-to-r from-black/60 to-black/90 hover:from-black/40 hover:to-black/60 text-white shadow-inner font-semibold text-xl'
                    onClick={() => { dispatch(removeUserId()) }}
                >Cancel</button>
                <button className={`${userRole === 'Admin' ? "flex" : "hidden"} py-1 px-2 border-1 border-slate-200 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-500 hover:to-blue-800 text-white shadow-inner font-semibold text-xl`}
                    onClick={() => { }}
                >Edit</button>
                <button className={`${userRole === 'Doctor' && personalInfo?.role === "Nurse" && !userData?.assignedDoctor ? "flex" : "hidden"} py-1 px-2 border-1 border-slate-200 rounded-lg bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-500 hover:to-blue-800 text-white shadow-inner font-semibold text-xl`}
                    onClick={handleAssignNurseButton}
                >Assign for Work</button>
            </div>
        </div>
    )
}

export default ShowUserDetails;