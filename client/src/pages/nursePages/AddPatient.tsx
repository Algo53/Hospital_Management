import React, { useEffect, useState } from "react";
import uploadFile from "../../components/Uploadar";
import { useNavigate } from "react-router-dom";
import { addPatientRoute, selectPatientStatus } from "../../redux/slices/PatientInfoSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { toast, ToastContainer } from "react-toastify";

function AddPatient() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectPatientStatus);
  const [loading, setLoading] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<IAddPatient>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    gender: "",
    photo: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    bloodGroup: "",
    bloodPressure: "",
    height: 0,
    weight: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files ? e.target.files[0] : null;
    const uploadAvatar = await uploadFile(file);
    setPatientData((prev) => {
      return {
        ...prev,
        photo: uploadAvatar.secure_url
      }
    })

  }

  const handleClearPhoto = () => {
    setPatientData((prev) => {
      return {
        ...prev,
        photo: ""
      }
    })
  }

  const handleSubmit = () => {
    dispatch(addPatientRoute(patientData));
    setLoading(true);
  }

  useEffect(() => {
    if (loading) {
      if (status === "idle") {
        setLoading(false);
        toast.success('Patient added successfully!', { autoClose: 5000 });
        setPatientData({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          phone: "",
          gender: "",
          photo: "",
          address: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          bloodGroup: "",
          bloodPressure: "",
          height: 0,
          weight: 0,
        })
      }
      else if (status === 'rejected') {
        setLoading(false);
        toast.error('Failed to add patient', { autoClose: 5000 });
      }
    }
  }, [status])

  return (
    <div className='flex flex-col gap-3 w-full h-max-screen'>
      <ToastContainer position="top-right" />
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
      <div className='flex text-2xl font-bold'>Add new Patient</div>
      <div className="flex flex-col gap-6 pb-3">
        <div className="flex flex-col md:flex-row bg-white/60 rounded-md p-6 w-full gap-4 hover:shadow-2xl">
          <div className="flex flex-col gap-3 md:w-1/3 w-full items-center justify-center">
            {
              patientData.photo ? (
                <>
                  <img src={patientData.photo} alt="" className="w-40 h-40 rounded-full" />
                  <div className="items-center justify-center px-2 py-2 cursor-pointer rounded-md hover:bg-black/20"><i className="fa-solid fa-xmark fa-2xl" onClick={handleClearPhoto} /></div>
                </>
              ) : (
                <>
                  <div className="flex p-[70px] bg-gray-200 rounded-full border-1 border-black">
                    <i className="fa-solid fa-user fa-2xl" />
                  </div>
                  <button className="flex bg-gradient-to-r from-blue-400 to-blue-700 hover:from-blue-300 hover:to-blue-500 hover:shadow-xl text-white font-bold p-2 rounded-lg relative">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      onChange={handlePhotoUpload}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    Upload Photo
                  </button>

                </>
              )
            }
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={patientData.firstName}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={patientData.lastName}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={patientData.email}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={patientData.phone}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            />
            <select
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={patientData.dateOfBirth}
              onChange={handleChange}
              className="p-3 border rounded-md w-full hover:shadow-2xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/60 rounded-md p-6 w-full gap-4 hover:shadow-2xl">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={patientData.address}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="text"
            name="emergencyContactName"
            placeholder="Emergency Contact Name"
            value={patientData.emergencyContactName}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="text"
            name="emergencyContactPhone"
            placeholder="Emergency Contact Phone"
            value={patientData.emergencyContactPhone}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="text"
            name="emergencyContactRelation"
            placeholder="Emergency Contact Relation"
            value={patientData.emergencyContactRelation}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="text"
            name="bloodGroup"
            placeholder="Blood Group"
            value={patientData.bloodGroup}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="text"
            name="bloodPressure"
            placeholder="Blood Pressure"
            value={patientData.bloodPressure}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={patientData.height === 0 ? '' : patientData.height}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={patientData.weight === 0 ? '' : patientData.weight}
            onChange={handleChange}
            className="p-3 border rounded-md w-full hover:shadow-2xl"
          />
        </div>

        <div className="flex justify-between">
          <div className="flex py-1 px-2 rounded-md bg-gradient-to-r from-black/30 to-black/90 hover:from-black/50 hover:to-black/100 text-white cursor-pointer text-xl" onClick={() => { navigate(-1) }}>Cancel</div>
          <div className="flex py-1 px-2 rounded-md bg-gradient-to-r from-blue-300 to-blue-700 hover:from-black/40 hover:to-black/100 text-white cursor-pointer text-xl" onClick={handleSubmit}>Add Patient</div>
        </div>
      </div>
    </div>
  )
}

export default AddPatient;