import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { RootState, useAppDispatch, useAppSelector } from "../redux/store";
import { selectMenu, selectRole, setMenu } from "../redux/slices/UserInfoSlice";

function Navbar() {
    const dispatch = useAppDispatch();
    const menu = useAppSelector(selectMenu);
    const role = useAppSelector(selectRole);
    const userInfo = useAppSelector((state: RootState) => state.userInfo.userInfo);
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const currDate = new Date;
        const format = currDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })
        setCurrentDate(format);
    }, [])

    return (
        <div className='flex w-full h-full items-center pt-4 pb-[2px] justify-between'>
            <div className="flex gap-2 pl-3 items-center">
                <div className={`${menu ? "hidden" : "flex"}  hover:bg-black/10 py-3 px-1 rounded-md cursor-pointer`} onClick={() => dispatch(setMenu())}>
                    <i className="fa-solid fa-bars fa-2xl" />
                </div>
                <div className='flex gap-3 items-center'>
                    <div className="md:flex hidden px-2 py-[18px] rounded-lg hover:bg-black/10"><i className="fa-solid fa-calendar-days fa-xl cursor-pointer" /></div>
                    <div className="sm:flex hidden">{currentDate}</div>
                </div>
            </div>
            <div className='flex gap-3 items-center pr-5 pl-2 pb-2'>
                <div className='xs:flex hidden items-center hover:bg-black/20 px-2 py-4 rounded-3xl'><i className="fa-regular fa-bell fa-2xl cursor-pointer" /></div>
                <div className="xs:flex hidden w-[2px] h-12 bg-black"></div>
                <Link to='profile' className="flex items-center gap-3 rounded-lg hover:bg-black/20 py-1 px-2 cursor-pointer">
                    {
                        userInfo?.photo ? (
                            <img src={userInfo.photo} alt="profile" className="w-12 h-12 rounded-full" />
                        )
                            : (
                                <div className="flex border-2 border-black/80 rounded-full py-[22px] px-2 items-center justify-center">
                                    <i className="fa-solid fa-user fa-2xl" />
                                </div>
                            )
                    }
                    <div className="flex flex-col">
                        <div className="font-bold text-lg">{userInfo?.firstName} {userInfo?.lastName}</div>
                        <div className="flex text-sm">{role}</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar