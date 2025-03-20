// store/ridesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rides: [], // Array to store rides
  selectedRide: null, // To store details of a single ride
  loading: false,
  error: null,
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    ridesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    ridesSuccess: (state, action) => {
      state.rides = action.payload;
      state.loading = false;
      state.error = null;
    },
    ridesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedRide: (state, action) => {
      state.selectedRide = action.payload;
    },
    clearSelectedRide: (state) => {
      state.selectedRide = null;
    },
    addRide: (state, action) => {
      state.rides.push(action.payload);
    },
    updateRide: (state, action) => {
      const updatedRide = action.payload;
      const index = state.rides.findIndex((ride) => ride._id === updatedRide._id);
      if (index !== -1) {
        state.rides[index] = updatedRide;
      }
    },
    removeRide: (state, action) => {
      state.rides = state.rides.filter((ride) => ride._id !== action.payload);
    },
  },
});

export const {
  ridesLoading,
  ridesSuccess,
  ridesFailure,
  setSelectedRide,
  clearSelectedRide,
  addRide,
  updateRide,
  removeRide,
} = ridesSlice.actions;

export default ridesSlice.reducer;