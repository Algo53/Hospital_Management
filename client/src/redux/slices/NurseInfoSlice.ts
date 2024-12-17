import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface INurseInfoState {
    newNurse: any | null;
    nurseInfo: INurse | null;
    allNurses: INurse[];
    status: 'idle' | 'loading' | 'rejected'
};

const initialState: INurseInfoState = {
    newNurse: null,
    nurseInfo: null,
    allNurses: [],
    status: 'idle'
};

export const addNurseRoute = createAsyncThunk(
    'add a new nurse',
    async (payload: IAddNurse, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;

            if (!token) return rejectWithValue("Token is missing");
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/admin/addNurse`, payload,
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

export const getAllNurseInfoRoute = createAsyncThunk(
    'Getting all nurse Details',
    async (_, { rejectWithValue }) => {

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/nurse/`,
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

export const getNurseInfoRoute = createAsyncThunk(
    'Getting nurse Info',
    async (_, {getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userInfo = state.userInfo.userInfo;
            const token = state.userInfo.token;
            
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/nurse/${userInfo?._id}`,
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

export const nurseInfoSlice = createSlice({
    name: 'nurseInfo',
    initialState,
    reducers: {
        resetNewNurse: (state) => {
            state.newNurse = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNurseRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addNurseRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.newNurse = action.payload;
            })
            .addCase(addNurseRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getAllNurseInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAllNurseInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.allNurses = action.payload.data;
            })
            .addCase(getAllNurseInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase( getNurseInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase( getNurseInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.nurseInfo = action.payload.data;
            })
            .addCase( getNurseInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })

    }
})

export const selectAllNurses = (state: RootState) => state.nurseInfo.allNurses;
export const selectNewNurse = (state: RootState) => state.nurseInfo.newNurse;
export const selectNurseInfo = (state: RootState) => state.nurseInfo.nurseInfo;
export const selectStatus = (state: RootState) => state.nurseInfo.status;

export const {resetNewNurse} = nurseInfoSlice.actions;
export default nurseInfoSlice.reducer;