import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import userInfoReducer from './slices/UserInfoSlice';
import adminInfoReducer from './slices/AdminInfoSlice';
import doctorInfoReducer from './slices/DoctorInfoSlice';
import nurseInfoReducer from './slices/NurseInfoSlice';

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    adminInfo: adminInfoReducer,
    doctorInfo: doctorInfoReducer,
    nurseInfo: nurseInfoReducer,
  },
});

// Export types for usage in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
