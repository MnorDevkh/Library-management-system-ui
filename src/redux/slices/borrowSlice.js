import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  borrowings: [],
  borrowingById: null,
};

const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    setBorrowings: (state, action) => {
      state.borrowings = action.payload;
    },
    setBorrowingById: (state, action) => {
      state.borrowingById = action.payload;
    },
  },
});

export const { setBorrowings, setBorrowingById } = borrowSlice.actions;
export default borrowSlice.reducer;