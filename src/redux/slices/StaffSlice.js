import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    staffs: [],
};

export const StaffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffs: (state, action) => {
      state.staffs = action.payload;
    },
  },
});

export const { setStaffs } = StaffSlice.actions;
export default StaffSlice.reducer;