import { createSlice } from "@reduxjs/toolkit";
const initstate = {
  user: null,
  allUsers: [],
};

export const UserSlice = createSlice({
  name: "user",
  initialState: initstate,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
  },
});
export const { setUser, setAllUsers } = UserSlice.actions;
export default UserSlice.reducer;
