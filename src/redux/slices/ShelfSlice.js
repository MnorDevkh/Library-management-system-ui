import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shelves: [],
};

export const ShelfSlice = createSlice({
  name: "shelf",
  initialState,
  reducers: {
    setShelf: (state, action) => {
      state.shelves = action.payload;
    },
  },
});

export const { setShelf } = ShelfSlice.actions;

export default ShelfSlice.reducer;