import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IAppointmentInfoState {
    newAppointment: IAppointment | null;
    appointmentInfo: IAppointment | null;
    allAppointments: IAppointment[];
    appointmentId: IdType | null;
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IAppointmentInfoState = {
    newAppointment: null,
    appointmentInfo: null,
    allAppointments: [],
    appointmentId: null,
    status: 'idle'
}

export const addAppointmentRoute = createAsyncThunk(
    'add a new appointment',
    async (payload: IAddAppointment, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            const userInfo = state.userInfo.userInfo;

            if (!token) return rejectWithValue("Token is missing");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/nurse/${userInfo?._id}/appointment/add`, payload,
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

export const getAllAppointmentRoute = createAsyncThunk(
    'Getting all appointment Details of the user',
    async (_, {getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            const userInfo = state.userInfo.userInfo;
    
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/user/${userInfo?._id}/appointments`,
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

export const getAppointmentInfoRoute = createAsyncThunk(
    'Getting appointment Info',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userInfo = state.userInfo.userInfo;
            const token = state.userInfo.token;

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/appointment/${userInfo?._id}`,
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

export const findAppointmentDetailsRoute = createAsyncThunk(
    'Finding appointment Details',
    async (payload: { appointmentId: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            if (!token) {
                return rejectWithValue({ error: 'Unauthorized' });
            }
            console.log(payload);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/appointment/find`, payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            console.log("The patient is : ", result);
            return result.success === true ? result : null;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAppointmentInfoRoute = createAsyncThunk(
    'update appointment Details Route',
    async (payload: { patientData: UpdatePatientParams, appointmentId: IdType }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            if (!token) {
                return rejectWithValue({ error: 'Unauthorized, Token is missing' });
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/appointment/${payload.appointmentId}/update`, payload.patientData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );
            const result = await response.data;
            return result.success ? result.data : null;
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
)

export const appointmentInfoSlice = createSlice({
    name: 'appointmentInfo',
    initialState,
    reducers: {
        setAppointmentId: (state, action: PayloadAction<any>) => {
            state.appointmentId = action.payload;
        },
        removeAppointmentId: (state) => {
            state.appointmentId = null;
        },
        resetAppointmentStatus: (state) => {
            state.status = 'idle';
        },
        resetAppointmentInfo: (state) => {
            state.appointmentInfo = null;
        },
        resetnewAppointment: (state) => {
            state.newAppointment = null;
            state.status = 'idle';
        },
        resetAppointmentState: (state) => {
            state = initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addAppointmentRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addAppointmentRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.newAppointment = action.payload;
            })
            .addCase(addAppointmentRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getAllAppointmentRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllAppointmentRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.allAppointments = action.payload.data;
            })
            .addCase(getAllAppointmentRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getAppointmentInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAppointmentInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.appointmentInfo = action.payload.data;
            })
            .addCase(getAppointmentInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(findAppointmentDetailsRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(findAppointmentDetailsRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.appointmentInfo= action.payload.data;
            })
            .addCase(findAppointmentDetailsRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updateAppointmentInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateAppointmentInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.appointmentInfo = action.payload.data;
            })
            .addCase(updateAppointmentInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })

    }
})

export const selectAllAppointments = (state: RootState) => state.appointmentInfo.allAppointments;
export const selectNewAppointment = (state: RootState) => state.appointmentInfo.newAppointment;
export const selectAppointmentInfo = (state: RootState) => state.appointmentInfo.appointmentInfo;
export const selectAppointmentStatus = (state: RootState) => state.appointmentInfo.status;

export const { setAppointmentId, removeAppointmentId, resetAppointmentStatus, resetAppointmentInfo, resetnewAppointment, resetAppointmentState } = appointmentInfoSlice.actions;
export default appointmentInfoSlice.reducer;