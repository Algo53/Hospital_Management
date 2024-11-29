import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IDoctorInfoState {
    newDoctor: any | null;
    doctorInfo: IDoctor | null;
    allDoctors: IDoctor[];
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IDoctorInfoState = {
    newDoctor: null,
    doctorInfo: null,
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
)

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
)

export const doctorInfoSlice = createSlice({
    name: 'doctorInfo',
    initialState,
    reducers: {
        resetNewDoctor: (state) => {
            state.newDoctor = null;
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

    }
})

export const selectAllDoctors = (state: RootState) => state.doctorInfo.allDoctors;
export const selectNewDoctor = (state: RootState) => state.doctorInfo.newDoctor;
export const selectDoctorInfo = (state: RootState) => state.doctorInfo.doctorInfo;
export const selectStatus = (state: RootState) => state.doctorInfo.status;

export const {resetNewDoctor} = doctorInfoSlice.actions;
export default doctorInfoSlice.reducer;