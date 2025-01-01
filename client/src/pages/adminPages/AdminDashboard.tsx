import { useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../../redux/store"
import { getAllDoctorInfoRoute, selectAllDoctors } from "../../redux/slices/DoctorInfoSlice";
import { getAllNurseInfoRoute, selectAllNurses } from "../../redux/slices/NurseInfoSlice";
import { getAdminInfoRoute, selectAdminInfo } from "../../redux/slices/AdminInfoSlice";
import { getAllPatientInfoRoute, selectAllPatients } from "../../redux/slices/PatientInfoSlice";

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const adminInfo = useAppSelector(selectAdminInfo);
  const allDoctors = useAppSelector(selectAllDoctors);
  const allStaff = useAppSelector(selectAllNurses);
  const allPatients = useAppSelector(selectAllPatients);

  const noOfDoctors = allDoctors?.length || 0;
  const noOfStaff = allStaff?.length || 0;
  const noOfPatients = allPatients?.length || 0; 
  const noOfBeds = 57; // Example static value

  const options = [
    {
      icon: 'user-doctor',
      name: "Total Doctors",
      value: noOfDoctors
    },
    {
      icon: 'user-nurse',
      name: "Total Staff",
      value: noOfStaff
    },
    {
      icon: 'people-group',
      name: "Total Patients",
      value: noOfPatients
    },
    {
      icon: 'bed-pulse',
      name: "Hospital bed",
      value: noOfBeds
    }
  ]

  useEffect( () => {
    if (!adminInfo) dispatch(getAdminInfoRoute());
    dispatch(getAllDoctorInfoRoute());
    dispatch(getAllNurseInfoRoute());
    dispatch(getAllPatientInfoRoute());
  }, [])
  
  return (
    <div className='flex w-full max-h-screen'>
      <div className='flex flex-col w-full h-full overflow-y-scroll hide-scrollbar'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full py-2 ">
          {options.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-3 shadow-inner rounded-2xl p-5 justify-between ${index >= options.length - 2
                ? "bg-gradient-to-r from-gray-700 to-black"
                : "bg-gradient-to-r from-blue-700 to-blue-400"
                } hover:shadow-2xl`}
            >
              <div className="flex py-4 px-3 rounded-full bg-white w-min">
                <i className={`fa-solid fa-${item.icon} fa-2xl`}></i>
              </div>
              <div className={`flex text-3xl font-semibold ${index >= options.length - 2 ? "text-white" : "text-white/90"}`}>
                {item.name}
              </div>
              <div className={`text-2xl font-semibold ${index >= options.length - 2 ? "text-white" : "text-white/90"}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default AdminDashboard;