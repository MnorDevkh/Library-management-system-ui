import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../service/authService";

export const signInAsync = createAsyncThunk(
  "auth/signInAsync",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signInService(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, user: null, error: null },
  reducers: {
    signIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // Store user data
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  }
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
