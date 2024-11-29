import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IAdminInfoState {
    adminInfo: IAdmin | null,
    staffId: IdType | null,
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IAdminInfoState = {
    adminInfo: null,
    staffId: null,
    status: 'idle'
}

export const getAdminInfoRoute = createAsyncThunk(
    'Getting Doctor Info',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userInfo = state.userInfo.userInfo;
            const token = state.userInfo.token;

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/admin/${userInfo?._id}`,
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

export const deleteStaffRoute = createAsyncThunk(
    'Deleting Staff',
    async (staffId: IdType, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;

            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/admin/delete/${staffId}`,
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

export const adminInfoSlice = createSlice({
    name: 'adminInfo',
    initialState,
    reducers: {
        setDeleteStaffId: (state, action: PayloadAction<any>) => {
            state.staffId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminInfoRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getAdminInfoRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.adminInfo = action.payload.data;
            })
            .addCase(getAdminInfoRoute.rejected, (state) => {
                state.status = "rejected";
            })
    }
})

export const selectAdminInfo = (state: RootState) => state.adminInfo.adminInfo;
export const selectStatus = (state: RootState) => state.adminInfo.status;

export const { setDeleteStaffId } = adminInfoSlice.actions;
export default adminInfoSlice.reducer;