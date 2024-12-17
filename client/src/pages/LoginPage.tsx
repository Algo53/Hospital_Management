import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from "../redux/store";
import { getUserDetailsRoute, loginRoute, selectStatus, selectToken, selectUser, selectUserInfo } from "../redux/slices/UserInfoSlice";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const userInfo = useAppSelector(selectUserInfo);
  const status = useAppSelector(selectStatus);

  const [role, setRole] = useState<string | null>(null);
  const [img, setImg] = useState<string>('/images/homePage3.webp');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserDetails((prevUserDetails) => ({ ...prevUserDetails, [name]: value }));
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginRoute(userDetails));
  }

  useEffect(() => {
    if (role) {
      if (role === 'Admin') {
        setImg('/images/homePage3.webp');
      }
      else if (role === 'Doctor') {
        setImg('/images/login.webp');
      }
      else {
        setImg(`/images/${role}Login.jpg`)
      }
    }
  }, [role])

  useEffect(() => {
    if (user && token) {
      dispatch(getUserDetailsRoute());
      setUserDetails({
        email: "",
        password: "",
      });
      if (userInfo) {
        setLoading(false);  // Hide loading toggle
        navigate(`${userInfo?._id}`);
      }
    }
    if (loading) {
      if (status !== "loading") {
        setLoading(false);  // Hide loading toggle
        toast.error("Signup failed. Please try again with correct credentials.", { autoClose: 5000 }); // Show error toast
      }
    }
  }, [user, status, userInfo, token])

  return (
    <div className="flex w-full h-full justify-center items-center">
      <ToastContainer position="top-right" />
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex h-2/3 sm:w-4/5 xl:w-3/5 w-full shadow-xl hover:shadow-2xl rounded-2xl">
        <div className="flex w-1/2">
          <img className="flex rounded-l-2xl" src={img} alt="" />
        </div>
        <div className="flex w-1/2 shadow-inner rounded-r-2xl px-5 py-3 bg-white">
          <div className="flex flex-col gap-[6px] xl:px-12 lg:px-8 w-full items-center justify-around">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex text-2xl font-bold">Login to your account</div>
              <div className="flex text-md">Enter your credentials to access your account.</div>
            </div>
            <div className="flex gap-2 w-full justify-between">
              <div className="flex text-lg md:text-xl w-full font-bold">Login as :</div>
              <select className="w-full flex shadow-inner text-xs sm:text-lg" value={role || ""} onChange={(event) => setRole(event.target.value)}>
                <option value="" disabled>Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Patient">Patient</option>
              </select>
            </div>
            <form onSubmit={handleLogin} className={`${role ? "flex" : "hidden"} flex-col w-full gap-2 overflow-y-scroll hide-scrollbar`}>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email" className="text-lg font-bold">Email</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="email" name="email" value={userDetails.email} onChange={handleInputChange} placeholder="jhondoe@gmail.com" /></div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password" className="text-lg font-bold">Password</label>
                <div className="flex border-slate-200 border-2 rounded-lg"><input className="w-full rounded-lg py-1 px-2 shadow-inner hover:bg-slate-100" type="password" name="password" value={userDetails.password} onChange={handleInputChange} placeholder="*********" /></div>
              </div>
              <div className="flex w-full pt-2">
                <button
                  type="submit"
                  disabled={!userDetails.email || !userDetails.password}
                  className={`flex w-full cursor-pointer ${userDetails.email && userDetails.password
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-200 cursor-not-allowed'
                    } text-2xl shadow-inner font-semibold justify-center rounded-md py-1`}
                >
                  Login
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
              Don't have an account?<Link to='/signup' className="px-2 text-blue-700 hover:text-blue-500">Register as Admin!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage