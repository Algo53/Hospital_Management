import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from "../redux/store";
import { registerRoute, selectStatus, selectUser } from "../redux/slices/UserInfoSlice";


function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    companyName: ""
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'dateOfBirth'){
      const [date, month, year] = value.split('-');
      setUserDetails(prevState => ({...prevState, dateOfBirth: `${date}-${month}-${year}`}))
    } else {
      setUserDetails((prevUserDetails) => ({ ...prevUserDetails, [name]: value }));
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(userDetails);
    setLoading(true); // Show loading toggle
    dispatch(registerRoute(userDetails));
  }

  useEffect(() => {
    if (user) {
      setLoading(false);  // Hide loading toggle
      toast.success("Account successfully created!", { autoClose: 5000 }); // Show success toast
      setUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        dateOfBirth: "",
        phone: "",
        companyName: ""
      });
      navigate('/login');
    }
    if (loading) {
      if (status !== "loading") {
        setLoading(false);  // Hide loading toggle
        toast.error("Signup failed. Please try again.", { autoClose: 5000 }); // Show error toast
      }
    }
  }, [user, status])

  return (
    <div className="flex w-full h-full justify-center items-center">
      <ToastContainer position="top-right"/>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex h-4/6 w-3/5 shadow-xl hover:shadow-2xl rounded-2xl">
        <div className="flex w-1/2">
          <img className="flex rounded-l-2xl" src="/images/homepage3.webp" alt="" />
        </div>
        <div className="flex w-1/2 shadow-inner rounded-r-2xl px-5 py-3 bg-white">
          <div className="flex flex-col gap-[6px] xl:px-12 lg:px-8 w-full items-center justify-around">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex text-2xl font-bold">Register as Admin</div>
            </div>
            <form onSubmit={handleRegister} className="flex flex-col w-full gap-2 overflow-y-scroll hide-scrollbar">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="companyName" className="text-lg font-bold">Organisation Name</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="text" name="companyName" value={userDetails.companyName} onChange={handleInputChange} placeholder="Enter your organisation name here..." /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="firstName" className="text-lg font-bold">FirstName</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="text" name="firstName" value={userDetails.firstName} onChange={handleInputChange} placeholder="Jhon" /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="lastName" className="text-lg font-bold">LastName</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="text" name="lastName" value={userDetails.lastName} onChange={handleInputChange} placeholder="Doe" /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="phone" className="text-lg font-bold">Phone</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="mobile" name="phone" value={userDetails.phone} onChange={handleInputChange} placeholder="Enter your mobile number..." /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email" className="text-lg font-bold">Email</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="email" name="email" value={userDetails.email} onChange={handleInputChange} placeholder="jhondoe@gmail.com" /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password" className="text-lg font-bold">Password</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="password" name="password" value={userDetails.password} onChange={handleInputChange} placeholder="*********" /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="gender" className="text-lg font-bold">Gender</label>
                <div className="flex border-slate-200 border-2 rounded-lg">
                  <input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="text" name="gender" value={userDetails.gender} onChange={handleInputChange} placeholder="Male or Female" />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="dateOfBirth" className="text-lg font-bold">Date Of Birth</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="date" name="dateOfBirth" value={userDetails.dateOfBirth} onChange={handleInputChange} placeholder="*********" /></div>
              </div>
              <div className="flex w-full pt-2">
                <button
                  type="submit"
                  disabled={!userDetails.email || !userDetails.password || loading}
                  className={`flex w-full cursor-pointer ${!loading && userDetails.email && userDetails.password
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-200 cursor-not-allowed'
                    } text-2xl shadow-inner font-semibold justify-center rounded-md py-1`}
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </div>
            </form>
            <div className="flex gap-2 w-full items-center">
              <div className="flex h-[2px] bg-black w-full"></div>
              <div className="flex ">OR</div>
              <div className="flex h-[2px] bg-black w-full"></div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="flex py-4 justify-center items-center w-full bg-zinc-100 hover:bg-zinc-50 cursor-pointer rounded-lg">
                <i className="fa-brands fa-google fa-2xl" style={{ color: "#74C0FC", }} />
              </div>
              <div className="flex py-4 justify-center items-center cursor-pointer w-full bg-zinc-100 hover:bg-zinc-50  rounded-lg">
                <i className="fa-brands fa-linkedin fa-2xl" />
              </div>
            </div>
            <div className="flex w-full">
              Already have an account?<Link to='/login' className="px-2 text-blue-700 hover:text-blue-500">Login!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegisterPage