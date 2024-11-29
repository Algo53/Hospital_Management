import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { selectUserInfo } from "../../redux/slices/UserInfoSlice";
import { NurseDegrees, NurseSpecialization } from "../../helper/specialization";
import uploadFile from "../../components/Uploadar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addNurseRoute, resetNewNurse, selectNewNurse, selectStatus } from "../../redux/slices/NurseInfoSlice";
import { useNavigate } from "react-router-dom";

interface NurseFormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: number | string;
    photo: string;
    gender: string;
    dateOfBirth: string;
    degree: string[];
    companyName: string;
    startTime: string;
    endTime: string;
    shiftTimings: string[];
    specialization: string[];
}

const AddNurse: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectStatus);
    const newNurse = useAppSelector(selectNewNurse);
    const userInfo = useAppSelector(selectUserInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [formData, setFormData] = useState<NurseFormState>({
        firstName: "",
        lastName: "",
        email: "",
        phone: '',
        photo: "",
        gender: "",
        dateOfBirth: "",
        degree: [],
        companyName: "",
        startTime: "",
        endTime: "",
        shiftTimings: [],
        specialization: [],
    });

    const [errors, setErrors] = useState<Partial<NurseFormState>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "specialization") {
            const specializations = formData.specialization.includes(value)
                ? formData.specialization.filter((item) => item !== value)
                : [...formData.specialization, value];

            setFormData((prev) => ({ ...prev, specialization: specializations }));
        } else if (name === "degree") {
            const deg = formData.degree.includes(value)
                ? formData.degree.filter((item) => item !== value)
                : [...formData.degree, value];
            setFormData((prev) => ({ ...prev, degree: deg }));
        } else if (name === "dateOfBirth") {
            const selectedDate = value;
            const [year, month, day] = selectedDate.split("-");
            const formattedDate = `${day}-${month}-${year}`;
            setFormData((prev) => ({ ...prev, dateOfBirth: formattedDate }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
            return updatedFormData;
        });
    };

    const addSlot = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const slot = `${formData.startTime}-${formData.endTime}`;
        const avSlot = formData.shiftTimings.includes(slot)
            ? formData.shiftTimings.filter((item) => item !== slot)
            : [...formData.shiftTimings, slot];
        setFormData((prev) => ({ ...prev, shiftTimings: avSlot }));
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<NurseFormState> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!formData.phone) newErrors.phone = "Phone number is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files ? e.target.files[0] : null;
        setAvatar(file);

        const uploadAvatar = await uploadFile(file);
        setFormData((prev) => {
            return {
                ...prev,
                photo: uploadAvatar.secure_url
            }
        })
    }

    const handleClearavatar = () => {
        setAvatar(null);
        setFormData((prev) => {
            return {
                ...prev,
                photo: ""
            }
        })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const data: IAddNurse = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: typeof formData.phone === "number" ? formData.phone : Number(formData.phone),
                photo: formData.photo,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
                degree: formData.degree,
                companyName: formData.companyName,
                shiftTimings: formData.shiftTimings,
                specialization: formData.specialization,
            }
            setLoading(true);
            console.log(data);
            dispatch(addNurseRoute(data));
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: '',
                photo: "",
                gender: "",
                dateOfBirth: "",
                degree: [],
                companyName: "",
                startTime: "",
                endTime: "",
                shiftTimings: [],
                specialization: [],
            });
            setAvatar(null);
            setErrors({});
        }
    };

    useEffect(() => {
        if (newNurse && loading) {
            setLoading(false);
            toast.success("Nurse Added succesfully!.", { autoClose: 5000 }); // Show error toast

            // Reset form fields and errors
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: '',
                photo: "",
                gender: "",
                dateOfBirth: "",
                degree: [],
                companyName: "",
                startTime: "",
                endTime: "",
                shiftTimings: [],
                specialization: [],
            });
            setAvatar(null);
            setErrors({});
            dispatch(resetNewNurse());
            // Scroll to top (optional)
            window.scrollTo(0, 0);
        }
        if (loading) {
            if (status !== "loading") {
                setLoading(false);  // Hide loading toggle
                toast.error("Action failed. Please try again!.", { autoClose: 5000 }); // Show error toast
            }
        }
    }, [newNurse, status])

    return (
        <div className="flex w-full h-full">
            <ToastContainer position="top-right" />
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                </div>
            )}
            <form
                onSubmit={handleSubmit}
                className="container mx-auto p-6 bg-white shadow-2xl hover:shadow-inner rounded-lg grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 overflow-y-scroll hide-scrollbar"
            >
                <h1 className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 text-xl font-bold text-center">
                    Add Nurse Form
                </h1>

                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="phone"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Organisation Name
                    </label>
                    <select
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select an organisation</option>
                        {userInfo && Array.isArray(userInfo.companyName) && userInfo?.companyName?.map((company: string, index: number) => (
                            <option key={index} value={company}>
                                {company}
                            </option>
                        ))}
                    </select>
                    {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        onChange={handleChange}
                        className="flex gap-1 w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Your Gender</option>
                        <option value="Male" style={{ marginBottom: "2px" }} className={`cursor-pointer p-2 rounded ${formData.gender === "Male" ? "bg-slate-200" : "bg-white"} text-black hover:bg-black/10`}>Male</option>
                        <option value="Female" style={{ marginBottom: "2px" }} className={`cursor-pointer p-2 rounded ${formData.gender === "Female" ? "bg-slate-200" : "bg-white"} text-black hover:bg-black/10`}>Female</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                        Degree
                    </label>
                    <select
                        id="degree"
                        name="degree"
                        multiple
                        size={1.5}
                        onChange={handleChange}
                        className="flex gap-1 w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {
                            NurseDegrees.map((item, index) => (
                                <option key={index} value={item} style={{ marginBottom: "2px" }} className={`cursor-pointer p-2 rounded ${formData.degree.includes(item) ? "bg-slate-200" : "bg-white"} text-black hover:bg-black/10`}>{item}</option>
                            ))
                        }
                    </select>
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.degree.join(", ")}
                    </p>
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Date Of Birth
                    </label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        onChange={handleChange}
                        className="flex w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    </input>
                </div>

                <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        Specialization
                    </label>
                    <select
                        id="specialization"
                        name="specialization"
                        multiple
                        size={2}
                        onChange={handleChange}
                        className="flex gap-1 w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {
                            NurseSpecialization.map((item, index) => (
                                <option key={index} value={item} style={{ marginBottom: "2px" }} className={`cursor-pointer p-2 rounded ${formData.specialization.includes(item) ? "bg-slate-200" : "bg-white"} text-black hover:bg-black/10`}>{item}</option>
                            ))
                        }
                    </select>
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.specialization.join(", ")}
                    </p>
                </div>

                <div>
                    <label htmlFor="shiftTimings" className="block text-sm font-medium text-gray-700">
                        <div className="flex items-center">Shift Timings : <p className="mt-2 pl-2  text-sm text-gray-600">{formData.shiftTimings.join(", ")}</p></div>
                    </label>
                    <div className="flex flex-wrap justify-around pt-2 pb-3">
                        {/* Start Time */}
                        <div className="flex gap-2 items-center">
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <input
                                type="time"
                                id="startTime"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleTimeChange}
                                className="mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* End Time */}
                        <div className="flex gap-2 items-center">
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                To
                            </label>
                            <input
                                type="time"
                                id="endTime"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleTimeChange}
                                className="mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button onClick={addSlot} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Add Shift
                    </button>
                    {errors.shiftTimings && <p className="text-red-500 text-sm">{errors.shiftTimings}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="useravatar" className="block text-sm font-medium text-gray-700">
                        Photo:
                    </label>
                    <div className="flex items-center space-x-3 mt-2">
                        {formData.photo ? (
                            <div className="flex items-center">
                                <img
                                    src={formData.photo}
                                    alt="Doctor Avatar"
                                    className="w-12 h-12 object-cover rounded-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleClearavatar}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    <i className="fa-solid fa-xmark fa-xl" />
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                onChange={handleAvatarChange}
                                className={`${avatar ? "hidden" : "flex"}`}
                            />
                        )}

                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? "Adding..." : "Add Nurse"}
                </button>
            </form>
        </div>
    );
};

export default AddNurse;