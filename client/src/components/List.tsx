import { useEffect, useState } from "react"
import { calculateAge } from "../helper/calculateAge"
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setDeleteStaffId } from "../redux/slices/AdminInfoSlice";
import { getShowUserDetails, selectRole, selectShowUserId, setUserId } from "../redux/slices/UserInfoSlice";

function List({ type, data }: { type: string, data: IDoctor[] | INurse[] | IPatient[] }) {
  const dispatch = useAppDispatch();
  const showUserId = useAppSelector(selectShowUserId);
  const [more, setMore] = useState<string | null>(null);
  const userRole = useAppSelector(selectRole);

  useEffect( () => {
    if (showUserId) dispatch(getShowUserDetails());
  }, [showUserId])

  return (
    <div className="flex flex-col gap-1 w-full py-2">
      {
        data.map((item: any, index) => (
          <div key={index} className="flex justify-between p-3 w-full bg-white/60 rounded-lg hover:shadow-2xl shadow-inner">
            <div className="flex lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 gap-2 items-center">
              <div className="flex w-10 h-10 rounded-full">
                {
                  item.userId.photo ? <img className="w-full h-full rounded-full" src={item.userId.photo} alt="" /> : <i className="fa-solid fa-user fa-2xl" />
                }
              </div>
              <div>{item.userId.firstName} {item.userId.lastName}</div>
            </div>
            <div className="flex lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 justify-center">
              {
                type === "Doctor" ? item.department : calculateAge(item.userId.dateOfBirth)
              }
            </div>
            <div className="sm:flex hidden lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 justify-center">
              {
                type === "Doctor" ?
                  item.specialization.map((e: string, index: number) => (
                    <span key={index} className="bg-black/5 h-min px-1 rounded">{e}</span>
                  ))
                  : item.userId.gender
              }
            </div>
            <div className="md:flex hidden lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 justify-center gap-1">
              {
                type === "Doctor" ?
                  item.degree.map((e: string, index: number) => (
                    <span key={index} className="bg-black/5 h-min px-1 rounded">{e}</span>
                  ))
                  : item.userId.phone
              }
            </div>
            <div className="hidden lg:flex lg:w-1/6 md:w-1/5 sm:w-1/4 w-1/3 justify-end gap-1">
              {
                type === "Doctor" ?
                  item.availableSlots.map((item: string, index: number) => (
                    <span key={index} className="bg-black/5 h-min px-1 rounded whitespace-nowrap">{item}</span>
                  ))
                  : type === "Nurse" ? (
                    <>{item.degree[0]}....</>
                  ) : (
                    <>{item.appointments.length}</>
                  )
              }
            </div>
            <div className={`flex lg:w-1/6 md:w-1/5 w-1/3 justify-end items-center gap-2`}>
              <div className={`${more == item._id ? "flex flex-col" : "hidden"} gap-1 text-sm items-center p-1 rounded-md bg-gray-100 shadow-lg `}>
                <button className="w-full bg-blue-500 text-white font-semibold py-[1px] px-2 rounded-[3px] hover:bg-blue-600 transition" onClick={() => {
                  dispatch(setUserId(item.userId._id));
                  setMore(null);
                }}
                >
                  More Details
                </button>
                <button className={`${userRole === "Admin" ? "flex" : "hidden"} w-full bg-red-500 text-white font-semibold py-[1px] px-2 rounded-[3px] hover:bg-red-600 transition`} onClick={() => dispatch(setDeleteStaffId(item._id))}>
                  Delete
                </button>
              </div>

              <div
                className={`${more == item._id ? "p-1" : "py-1 px-2"} rounded-lg hover:bg-black/10 cursor-pointer`}
                onClick={
                  () => {
                    if (more) {
                      if (more == item._id) setMore(null);
                      else setMore(item._id);
                    } else {
                      setMore(item._id);
                    }
                  }
                }
              >
                <i className={`fa-solid fa-${more == item._id ? "xmark" : "ellipsis fa-2xl"} `} />
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default List