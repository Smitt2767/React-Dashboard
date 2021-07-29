import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const initialState = {
  username: null,
  messages: [],
  socketId: null,
  showModal: false,
  typer: "",
  activeUsers: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
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
  },
});

export const {
  setUsername,
  setSocketId,
  setShowModal,
  addMessage,
  setTyper,
  setActiveUsers,
} = chatSlice.actions;

export default chatSlice.reducer;
