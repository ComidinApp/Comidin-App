import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    currentAddress: null,
  },
  reducers: {
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    clearAddress: (state) => {
      state.currentAddress = null;
    },
  },
});

export const { setCurrentAddress, clearAddress } = addressSlice.actions;

// Selector memoizado para mejor rendimiento
export const selectCurrentAddress = (state) => state.address.currentAddress;

export default addressSlice.reducer; 