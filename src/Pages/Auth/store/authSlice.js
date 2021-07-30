import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAuth = action.payload.isAuth;
    },
    resetAuthData: (state, action) => {
      state.username = initialState.username;
      state.email = initialState.email;
      state.isAuth = initialState.isAuth;
    },
  },
});

export const { setAuthData, resetAuthData } = authSlice.actions;
export default authSlice.reducer;
