import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentRoute: "/",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setCurrentRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
  },
});

export const { setCurrentRoute } = sidebarSlice.actions;

export default sidebarSlice.reducer;
