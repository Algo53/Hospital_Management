import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

interface IUserInfoState {
    mode: 'dark' | 'light';
    menu: boolean;
    user: boolean;
    token: string | null;
    role: "Admin" | "Doctor" | "Nurse" | "Patient" | null;
    userInfo: IUser | null;
    status: 'idle' | 'loading' | 'rejected'
}

const initialState: IUserInfoState = {
    mode: 'light',
    menu: false,
    user: false,
    token: null,
    role: null,
    userInfo: null,
    status: 'idle'
}

export const registerRoute = createAsyncThunk(
    'registerRoute',
    async (payload: ICreateAdmin, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/signup`, payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;

            return result.success === true ? result.success : false;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const loginRoute = createAsyncThunk(
    'Login User',
    async (payload: LoginUserParams, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/auth/login`, payload, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true,
            })
            const result = await response.data;

            return result.success === true ? result : false;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateUserRoute = createAsyncThunk(
    'Update User details',
    async (payload: UpdateUserParams, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.userInfo.token;
            if (!token) return rejectWithValue("Token is missing");

            const userInfo = state.userInfo.userInfo;
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/user/${userInfo?._id}/update`, payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                }
            )
            const result = await response.data;
            return result.success === true ? result : false
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getUserDetailsRoute = createAsyncThunk(
    'Getting User Details form the authToken',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const token = state.userInfo.token;

        if (!token) return rejectWithValue("Token is missing");

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/user/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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


export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        setMenu: (state) => {
            state.menu = !(state.menu);
        },
        setMode: (state) => {
            if (state.mode === 'light') {
                state.mode = 'dark';
            }
            else {
                state.mode = 'light';
            }
        },
        userInfoReset: (state) => {
            state.mode = 'light';
            state.user = false;
            state.token = null;
            state.status = "idle";
            state.role = null;
            state.userInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(registerRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.user = action.payload;
            })
            .addCase(registerRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(loginRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(loginRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                state.user = action.payload.success;
                state.token = action.payload.accessToken;
                state.role = action.payload.role
            })
            .addCase(loginRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(getUserDetailsRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getUserDetailsRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
                const { user, data } = action.payload;
                const companyName = user.role === "Admin"
                    ? (Array.isArray(data.companyName) ? data.companyName : []) // Ensure companyName is an array of strings if Admin
                    : data.companyName; // Otherwise, it's a single string

                state.userInfo = {
                    ...user,                  // Spread all fields from user
                    companyName: companyName  // Add or override the companyName field
                };
            })
            .addCase(getUserDetailsRoute.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updateUserRoute.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateUserRoute.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "idle";
            })
            .addCase(updateUserRoute.rejected, (state) => {
                state.status = "rejected";
            })
    }
})

export const selectMode = (state: RootState) => state.userInfo.mode;
export const selectMenu = (state: RootState) => state.userInfo.menu;
export const selectRole = (state: RootState) => state.userInfo.role;
export const selectToken = (state: RootState) => state.userInfo.token;
export const selectUser = (state: RootState) => state.userInfo.user;
export const selectUserInfo = (state: RootState) => state.userInfo.userInfo;
export const selectStatus = (state: RootState) => state.userInfo.status;

export const { setMenu, setMode, userInfoReset } = userInfoSlice.actions;
export default userInfoSlice.reducer;