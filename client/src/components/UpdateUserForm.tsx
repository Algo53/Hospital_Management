import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/store';
import { getUserDetailsRoute, selectStatus, selectUserInfo, updateUserRoute } from '../redux/slices/UserInfoSlice';
import uploadFile from './Uploadar';
import { toast, ToastContainer } from 'react-toastify';

type UpdateUserFormProps = {
    updateClick: boolean;
    update: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdateClick: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateUserForm({ update, updateClick, setUpdateClick }: UpdateUserFormProps) {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(selectUserInfo);
    const status = useAppSelector(selectStatus);
    const [loading, setLoading] = useState<boolean>(false);
    const [updatePersonalInfo, setUpdatePersonalInfo] = useState<UpdateUserParams>({
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        photo: userInfo?.photo || null,
        dateOfBirth: userInfo?.dateOfBirth || "",
        gender: userInfo?.gender || "",
    })

    const checkDetails = (up: UpdateUserParams, old: IUser | null) => {
        if (old === null) return false;

        if (up.firstName != old.firstName) return true;
        else if (up.lastName != old.lastName) return true;
        else if (up.email != old.email) return true;
        else if (up.phone != old.phone) return true;
        else if (up.photo != old.photo) return true;
        else if (up.dateOfBirth != old.dateOfBirth) return true;
        return false;
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files ? e.target.files[0] : null;

        const uploadAvatar = await uploadFile(file);
        setUpdatePersonalInfo(UpdateUserParams => ({ ...UpdateUserParams, photo: uploadAvatar.secure_url }));
    }

    const handleClearavatar = () => {
        setUpdatePersonalInfo(UpdateUserParams => ({ ...UpdateUserParams, photo: null }));
    }

    const handleUpdateInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "dateOfBirth") {
            const dt = value.split('-');
            const [date, month, year] = dt;
            setUpdatePersonalInfo((prev) => ({ ...prev, dateOfBirth: `${date}-${month}-${year}` }));
        }
        else {
            setUpdatePersonalInfo((prev) => ({ ...prev, [name]: value }));
        }
    }

    useEffect(() => {
        if (updateClick) {
            setLoading(true);
            if (checkDetails(updatePersonalInfo, userInfo)) dispatch(updateUserRoute(updatePersonalInfo));
            else {
                setLoading(false);
                update(false);
                setUpdateClick(false);
            }
        }
    }, [updateClick])

    useEffect(() => {
        if (status === 'rejected') {
            toast.error("Failed to update user info", { autoClose: 3000 });
            setLoading(false);
            update(false);
            setUpdateClick(false);
        }
        if (status === 'idle' && updateClick) {
            toast.success("User info updated successfully", { autoClose: 3000 });
            setLoading(false);
            update(false);
            setUpdateClick(false);
            dispatch(getUserDetailsRoute());
        }
    }, [status]);

    return (
        <div className='flex flex-col gap-3 w-full'>
            <ToastContainer position="top-right" />
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
            <div className='flex items-center'>
                <div className="flex w-1/2 text-xl font-semibold">Photo</div>
                <div className="flex w-1/2">
                    {
                        updatePersonalInfo?.photo ?
                            <div className='flex gap-2 items-center'>
                                <img src={updatePersonalInfo.photo} alt='profile' className='w-12 h-12 rounded-full object-cover' />
                                <div className='flex py-3 px-1 rounded-md hover:bg-black/10 cursor-pointer'>
                                    <i className='fa-solid fa-xmark fa-2xl' onClick={handleClearavatar} />
                                </div>
                            </div>
                            :
                            <input type="file" id="photo" name="photo" onChange={handleAvatarChange} className={`${updatePersonalInfo.photo ? "hidden" : "flex"}`} />
                    }

                </div>
            </div>
            <div className='flex w-full h-[1px] bg-slate-400'></div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center">
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">First Name</div>
                    <input className='py-1 px-2 rounded-md bg-slate-200' type='text' name='firstName' value={updatePersonalInfo.firstName} onChange={handleUpdateInfoChange} />
                </div>
                <div className='md:hidden flex w-full h-[1px] bg-slate-400'></div>
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">Last Name</div>
                    <input className='py-1 px-2 rounded-md bg-slate-200' type='text' name='lastName' value={updatePersonalInfo.lastName} onChange={handleUpdateInfoChange} />
                </div>
            </div>
            <div className='flex w-full h-[1px] bg-slate-400'></div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center">
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">Email Address</div>
                    <input className='py-1 px-2 rounded-md bg-slate-200' type='text' name='email' value={updatePersonalInfo.email} onChange={handleUpdateInfoChange} />
                </div>
                <div className='md:hidden flex w-full h-[1px] bg-slate-400'></div>
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">Phone</div>
                    <input className='py-1 px-2 rounded-md bg-slate-200' type='phone' name='phone' value={updatePersonalInfo.phone} onChange={handleUpdateInfoChange} />
                </div>
            </div>
            <div className='flex w-full h-[1px] bg-slate-400'></div>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center">
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">Date Of Birth</div>
                    <input className='py-1 px-2 rounded-md bg-slate-200' type='date' name='dateOfBirth' value={updatePersonalInfo.dateOfBirth} onChange={handleUpdateInfoChange} />
                </div>
                <div className='md:hidden flex w-full h-[1px] bg-slate-400'></div>
                <div className="flex w-full md:w-1/2 justify-between">
                    <div className="flex w-1/2 text-xl font-semibold">Gender</div>
                    <select className='py-1 px-2 rounded-md bg-slate-200' name='gender' value={updatePersonalInfo.gender} onChange={handleUpdateInfoChange}>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                </div>
            </div>
            <div className='flex w-full h-[2px] bg-black'></div>
        </div>
    )
}

export default UpdateUserForm;