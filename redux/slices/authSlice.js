import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userId: null,
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    // ... otros reducers ...
  },
});

export const { setUserId } = authSlice.actions;

// Selector para obtener el userId
export const selectUserId = (state) => state.auth.userId;

export default authSlice.reducer; 