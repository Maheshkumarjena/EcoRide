import { combineReducers } from 'redux';
import userReducer from '@/slices/userSlice';
import rideReducer from '@/slices/rideSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ride: rideReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})