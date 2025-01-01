import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IDoctorInfoState {
    newDoctor: any | null;
    doctorInfo: IDoctor | null;
    doctorSlots:  { value: string; data: string }[];
    allDoctors: IDoctor[];
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IDoctorInfoState = {
    newDoctor: null,
    doctorInfo: null,
    doctorSlots: [],
    allDoctors: [],
    status: 'idle'
}

export const addDoctorRoute = createAsyncThunk(
    'add a new doctor',
    async (payload: IAddDoctor, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;

            if (!token) return rejectWithValue("Token is missing");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/admin/addDoctor`, payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;

            return result.success === true ? result : false;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAllDoctorInfoRoute = createAsyncThunk(
    'Getting all doctors Details',
    async (_, { rejectWithValue }) => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/doctor/`,
                {
                    withCredentials: true
                }
            )
            const result = await response.data;

            return result.success === true ? result : null;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getDoctorInfoRoute = createAsyncThunk(
    'Getting Doctor Info',
    async (_, {getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userInfo = state.userInfo.userInfo;
            const token = state.userInfo.token;
            
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/doctor/${userInfo?._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            return result.success === true ? result : null;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const assignNurseToDoctor = createAsyncThunk(
    'Assign a Nurse under the doctor for work',
    async(payload : {nurseId: IdType}, {getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            const doctorInfo = state.doctorInfo.doctorInfo;
            const doctorId = doctorInfo?._id;
            if (!doctorId || !token) {
                return rejectWithValue('DoctorId or token is missing');
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/doctor/${doctorId}/assign/nurse`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            return result.success ? true : false 
        } catch(error: any){
            return rejectWithValue(error.response.data);
        }

    }
);

export const getDoctorAssignedSlots = createAsyncThunk(
    'Finding the doctor assigned slots',
    async(payload: {doctorId: IdType}, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/doctor/${payload.doctorId}/assignedSlots`,
                {
                    withCredentials: true
                }
            )
            const result = await response.data;
            return result.success ? result.data : [];
        }catch(error: any){
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAppointment = createAsyncThunk(
    "Update the Appointment By the Doctor",
    async(payload: {appointmentId: IdType, data: UpdateAppointmentData}, {getState, rejectWithValue}) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            const doctorInfo = state.doctorInfo.doctorInfo;
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/doctor/appointment/update/${payload.appointmentId}`, {data: payload.data, doctorId: doctorInfo?._id}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            })
            const result = await response.data;
            return result.success ? result.data : null;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const doctorInfoSlice = createSlice({
    name: 'doctorInfo',
    initialState,
    reducers: {
        resetNewDoctor: (state) => {
            state.newDoctor = null;
            state.status = 'idle';
        },
        resetDoctorStatus: (state) => {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addDoctorRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addDoctorRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.newDoctor = action.payload;
            })
            .addCase(addDoctorRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getAllDoctorInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllDoctorInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.allDoctors = action.payload.data;
            })
            .addCase(getAllDoctorInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase( getDoctorInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase( getDoctorInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.doctorInfo = action.payload.data;
            })
            .addCase( getDoctorInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getDoctorAssignedSlots.fulfilled, (state, action: PayloadAction<any>) => {
                state.doctorSlots = action.payload;
            })
            .addCase(updateAppointment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAppointment.fulfilled, (state) => {
                state.status = 'idle';
            })
            .addCase(updateAppointment.rejected, (state) => {
                state.status = 'rejected'
            })
    }
})

export const selectAllDoctors = (state: RootState) => state.doctorInfo.allDoctors;
export const selectNewDoctor = (state: RootState) => state.doctorInfo.newDoctor;
export const selectDoctorInfo = (state: RootState) => state.doctorInfo.doctorInfo;
export const selectDoctorSlots = (state: RootState) => state.doctorInfo.doctorSlots;
export const selectDoctorStatus = (state: RootState) => state.doctorInfo.status;

export const { resetNewDoctor, resetDoctorStatus } = doctorInfoSlice.actions;
export default doctorInfoSlice.reducer;