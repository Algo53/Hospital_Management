import { useEffect, useState } from "react";
import { selectRole, selectUserInfo, userInfoReset } from "../redux/slices/UserInfoSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectAdminInfo } from "../redux/slices/AdminInfoSlice";
import { selectDoctorInfo } from "../redux/slices/DoctorInfoSlice";
import { PersonalVariables } from "../helper/ProfiePageVariables";
import { selectNurseInfo } from "../redux/slices/NurseInfoSlice";
import { useNavigate } from "react-router-dom";
import UpdateUserForm from "../components/UpdateUserForm";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectRole);
  const userInfo = useAppSelector(selectUserInfo);
  const adminInfo = useAppSelector(selectAdminInfo);
  const doctorInfo = useAppSelector(selectDoctorInfo);
  const nurseInfo = useAppSelector(selectNurseInfo);
  const [updateButton, setUpdateButton] = useState<boolean>(false);
  const [updateClick, setUpdateClick] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [userDetails, setDetails] = useState<IUser | null>(userInfo);

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(userInfoReset());
  }

  useEffect(() => {
    if (userRole === 'Admin') setData(adminInfo);
    else if (userRole === "Doctor") setData(doctorInfo);
    else if (userRole === "Nurse") setData(nurseInfo);
  }, [doctorInfo, adminInfo, nurseInfo]);

  useEffect(() => {
    if (userInfo) setDetails(userInfo);
    else navigate('/login');
  }, [userInfo]);

  return (
    <div className='flex flex-col flex-grow w-full h-full gap-3'>
      <div className='flex text-md xs:text-lg md:text-xl font-bold'>Manage Your Personal Informations</div>
      <div className='flex flex-grow flex-col gap-3 p-3 w-full h-full border-2 border-black/50 rounded-lg bg-white shadow-xl hover:shadow-2xl overflow-y-scroll hide-scrollbar'>
        <div className="flex w-full justify-between items-center">
          <div className='flex text-sm md:text-xl text-lg font-semibold'>General Information</div>
          <div className="flex xs:gap-2 gap-1 items-center">
            <div className='flex md:text-2xl xs:text-xl text-md font-semibold'>Role</div>
            <div className="flex xs:text-lg text-sm font-medium p-1 bg-black/5 border-1 border-black rounded-lg shadow-inner">{userRole}</div>
          </div>
        </div>
        <div className='flex w-full h-[2px] bg-slate-400'></div>
        {
          updateButton ?
            (
              <UpdateUserForm update={setUpdateButton} updateClick={updateClick} setUpdateClick={setUpdateClick} />
            )
            :
            (
              <>
                <div className='flex items-center'>
                  <div className="flex w-1/2 xs:text-xl text-md font-semibold">Photo</div>
                  <div className="flex w-1/2">
                    {
                      userDetails?.photo ?
                        <img src={userDetails.photo} alt='profile' className='w-12 h-12 rounded-full object-cover' />
                        : <div className="flex px-[9px] py-4 border-black border-2 rounded-full"><i className="fa-solid fa-user fa-2xl" /></div>
                    }
                  </div>
                </div>
                <div className='flex w-full h-[1px] bg-slate-400'></div>
                {
                  PersonalVariables.map((value, index) =>
                    index % 4 === 0 ? (
                      <>
                        <div key={index} className="flex flex-col md:flex-row gap-3 md:gap-0 items-center">
                          <div className="flex w-full md:w-1/2 justify-between">
                            <div className="flex w-1/2 xs:text-xl text-md font-semibold">{PersonalVariables[index]}</div>
                            <div className="flex w-1/2 font-normal xs:text-lg text-md">
                              {userDetails?.[PersonalVariables[index + 1] as keyof typeof userInfo]}
                            </div>
                          </div>
                          <div className='md:hidden flex w-full h-[1px] bg-slate-400'></div>
                          {index + 2 < PersonalVariables.length && index + 3 < PersonalVariables.length && (
                            <div className="flex w-full md:w-1/2 justify-between">
                              <div className="flex w-1/2 xs:text-xl text-md font-semibold">{PersonalVariables[index + 2]}</div>
                              <div className="flex w-1/2 font-normal xs:text-lg text-md">
                                {userDetails?.[PersonalVariables[index + 3] as keyof typeof userInfo]}
                              </div>
                            </div>
                          )}
                        </div>
                        <div key={(index + 1) * 200} className='flex w-full h-[1px] bg-slate-400'></div>
                      </>
                    ) : null
                  )
                }
              </>
            )
        }
        {
          userRole === 'Admin' ?
            (
              <div className="flex w-full items-center">
                <div className="flex w-1/2 xs:text-xl text-md font-semibold">Organisations</div>
                <div className="flex w-1/2 gap-1 text-lg font-medium">
                  {
                    data?.companyName.map((item: string, index: number) => (
                      <div key={index} className="flex p-1 bg-black/10 rounded-md">{item}</div>
                    ))
                  }
                </div>
              </div>
            )
            : userRole === "Doctor" ?
              (
                <div className="flex flex-col md:flex-row gap-3 justify-center">
                  <div className='flex w-full md:w-1/2 justify-between items-center'>
                    <div className="flex w-1/2 xs:text-xl text-md font-semibold">Organisation</div>
                    <div className="flex w-1/2 gap-1 xs:text-xl text-md font-medium">{data?.companyName}</div>
                  </div>
                  <div className='flex md:hidden w-full h-[1px] bg-slate-400'></div>
                  <div className='flex w-full md:w-1/2 justify-between items-center'>
                    <div className="flex w-1/2 xs:text-xl text-md font-semibold">Department</div>
                    <div className="flex w-1/2">
                      {
                        data?.department && <div className="flex p-1 bg-black/10 rounded-md xs:text-xl text-md">{data?.department}</div>
                      }
                    </div>
                  </div>
                </div>
              )
              :
              (
                <div className='flex w-full items-center'>
                  <div className="flex w-1/2 xs:text-xl text-md font-semibold">Organisation</div>
                  <div className="flex w-1/2 gap-1 xs:text-xl text-md font-medium">{data?.companyName}</div>
                </div>
              )
        }
        {
          userRole === 'Doctor' || userRole === "Nurse" ? (
            <>
              <div className='flex w-full h-[1px] bg-slate-400'></div>
              <div className="flex flex-col justify-center gap-3">
                <div className='flex w-full justify-between items-center'>
                  <div className="flex w-1/2 xs:text-xl text-md font-semibold">Degree</div>
                  <div className="flex flex-col md:flex-row w-1/2 gap-1">
                    {
                      data?.degree && data.degree.map((item: string, index: number) => (
                        <div key={index} className="flex p-1 bg-black/10 rounded-md whitespace-nowrap overflow-x-scroll hide-scrollbar">{item}</div>
                      ))
                    }
                  </div>
                </div>
                <div className='flex w-full h-[1px] bg-slate-400'></div>
                <div className='flex w-full justify-between items-center'>
                  <div className="flex w-1/2 xs:text-xl text-md font-semibold">Specialization</div>
                  <div className="flex w-1/2">
                    {
                      data?.specialization && <div className="flex p-1 bg-black/10 rounded-md">{data?.specialization}</div>
                    }
                  </div>
                </div>
              </div>
              <div className='flex w-full h-[1px] bg-slate-400'></div>
            </>
          ) : null
        }
      </div>
      <div className="flex w-full justify-between">
        <button className={`${updateButton ? "hidden" : "flex"} text-lg font-bold p-2 border-1 border-black rounded-md cursor-pointer hover:bg-black/20`} onClick={handleLogout}>Logout</button>
        <button className={`${updateButton ? "flex" : "hidden"} text-lg font-bold p-2 border-1 border-black rounded-md cursor-pointer hover:bg-black/20`} onClick={() => { setUpdateButton(!updateButton) }}>Cancel</button>
        <button className={`${updateButton ? "hidden" : "flex"} text-lg font-bold py-2 px-3 border-1 border-black rounded-md cursor-pointer bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-600 hover:to-blue-800`} onClick={() => setUpdateButton(!updateButton)}>Edit</button>
        <button className={`${updateButton ? "flex" : "hidden"} text-lg font-bold py-2 px-3 border-1 border-black rounded-md cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-600 hover:to-blue-800`} onClick={() => setUpdateClick(!updateClick)}>{updateClick ? "Updating..." : "Update"}</button>
      </div>
    </div>
  )
}

export default ProfilePage;