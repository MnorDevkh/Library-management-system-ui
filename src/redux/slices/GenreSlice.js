import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
  genreById: [],
};
const GenreSlice = createSlice({
  name: "genre", // Name of the slice
  initialState, // Initial state of the slice
  reducers: {
    // Reducers
    setGenres: (state, action) => {
      state.genres = action.payload;
    },
    setGenreById: (state, action) => {
      state.genreById = action.payload;
    },
  },
});
export const { setGenres, setGenreById } = GenreSlice.actions;
export default GenreSlice.reducer;
