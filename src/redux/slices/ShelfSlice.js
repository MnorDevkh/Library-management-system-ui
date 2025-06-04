import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shelves: [],
    shelfById: [],
};

export const ShelfSlice = createSlice({
  name: "shelf",
  initialState,
  reducers: {
    setShelf: (state, action) => {
      state.shelves = action.payload;
    },
    setShelfById: (state, action) => {
        state.shelfById= action.payload;
    }
  },
});

export const { setShelf ,setShelfById} = ShelfSlice.actions;

export default ShelfSlice.reducer;