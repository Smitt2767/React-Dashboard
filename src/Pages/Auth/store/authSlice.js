import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  isAuth: false,
  avatar: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.username = action.payload.username;
      state.isAuth = action.payload.isAuth;
      state.avatar = action.payload.avatar || null;
    },
    resetAuthData: (state, action) => {
      state.username = initialState.username;
      state.isAuth = initialState.isAuth;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
  },
});

export const { setAuthData, resetAuthData, setUsername, setAvatar } =
  authSlice.actions;
export default authSlice.reducer;
