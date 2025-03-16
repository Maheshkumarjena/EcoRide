// File: userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null }, // Initial state
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Update user state
    },
    clearUser: (state) => {
      state.user = null; // Clear user state
    },
  },
});

export const { setUser, clearUser } = userSlice.actions; // Export actions
export default userSlice.reducer; // Export reducer
