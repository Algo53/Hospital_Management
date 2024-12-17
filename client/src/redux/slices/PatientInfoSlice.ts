import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IPatientInfoState {
    newPatient: any | null;
    patientInfo: IPatient | null;
    allPatients: IPatient[];
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IPatientInfoState = {
    newPatient: null,
    patientInfo: null,
    allPatients: [],
    status: 'idle'
}

export const addPatientRoute = createAsyncThunk(
    'add a new Patient',
    async (payload: IAddPatient, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            const userInfo = state.userInfo.userInfo;

            if (!token) return rejectWithValue("Token is missing");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/nurse/${userInfo?._id}/patient/add`, payload,
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

export const getAllPatientInfoRoute = createAsyncThunk(
    'Getting all patient Details',
    async (_, { rejectWithValue }) => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/patient/`,
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

export const getPatientInfoRoute = createAsyncThunk(
    'Getting patient Info',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userInfo = state.userInfo.userInfo;
            const token = state.userInfo.token;

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/patient/${userInfo?._id}`,
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

export const findPatientDetailsRoute = createAsyncThunk(
    'Finding patient Details',
    async (payload: { patientId: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            if (!token) {
                return rejectWithValue({ error: 'Unauthorized' });
            }
            console.log(payload);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/patient/find`, payload,
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

export const updatePatientDetailsRoute = createAsyncThunk(
    'update Patient Details Route',
    async (payload: { patientData: UpdatePatientParams, patientId: IdType }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            if (!token) {
                return rejectWithValue({ error: 'Unauthorized, Token is missing' });
            }

            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/patient/${payload.patientId}/update`, payload.patientData,
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

export const patientInfoSlice = createSlice({
    name: 'patientInfo',
    initialState,
    reducers: {
        resetPatientStatus: (state) => {
            state.status = 'idle';
        },
        resetPatientInfo: (state) => {
            state.patientInfo = null;
        },
        resetNewPatient: (state) => {
            state.newPatient = null;
            state.status = 'idle';
        },
        resetPatientState: (state) => {
            state.newPatient = null;
            state.patientInfo = null;
            state.newPatient = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addPatientRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addPatientRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.newPatient = action.payload;
            })
            .addCase(addPatientRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getAllPatientInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllPatientInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.allPatients = action.payload.data;
            })
            .addCase(getAllPatientInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getPatientInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getPatientInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.patientInfo = action.payload.data;
            })
            .addCase(getPatientInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(findPatientDetailsRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(findPatientDetailsRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.patientInfo = action.payload.data;
            })
            .addCase(findPatientDetailsRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updatePatientDetailsRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatePatientDetailsRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.patientInfo = action.payload.data;
            })
            .addCase(updatePatientDetailsRoute.rejected, (state) => {
                state.status = "rejected";
            })

    }
})

export const selectAllPatients = (state: RootState) => state.patientInfo.allPatients;
export const selectNewPatient = (state: RootState) => state.patientInfo.newPatient;
export const selectPatientInfo = (state: RootState) => state.patientInfo.patientInfo;
export const selectPatientStatus = (state: RootState) => state.patientInfo.status;

export const { resetPatientStatus, resetPatientInfo, resetNewPatient, resetPatientState } = patientInfoSlice.actions;
export default patientInfoSlice.reducer;