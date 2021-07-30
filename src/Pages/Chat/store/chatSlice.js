import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const initialState = {
  messages: [],
  socketId: null,
  typer: "",
  activeUsers: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push({
        byMe: action.payload.byMe,
        message: action.payload.message,
        by: action.payload.by,
        at: moment().format("hh:mm a"),
      });
    },
    setTyper: (state, action) => {
      state.typer = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = [
        ...action.payload.filter((user) => user.id !== state.socketId),
      ];
    },
    resetChatData: (state, action) => {
      state.messages = initialState.messages;
      state.activeUsers = initialState.activeUsers;
      state.typer = initialState.typer;
    },
  },
});

export const {
  setSocketId,
  addMessage,
  setTyper,
  setActiveUsers,
  resetChatData,
} = chatSlice.actions;

export default chatSlice.reducer;
