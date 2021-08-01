import socketIoClient from "socket.io-client";
import constants from "../constants";
import store from "../store";
import { setErrorMessage } from "../store/dashboardSlice";
import {
  setSocketId,
  addMessage,
  setTyper,
  setActiveUsers,
} from "../Pages/Chat/store/chatSlice";
import { setActiveStatusForUser } from "../Pages/PrivateChat/store/privateChatSlice";
import * as jwt from "./jwtService";
let socket;

export const connectWithWebSocket = () => {
  socket = socketIoClient(constants.API_URL, {
    auth: {
      token: JSON.parse(localStorage.getItem("token")),
    },
  });

  socket.on("connect_error", (err) => {
    store.dispatch(setErrorMessage(err.message));
    jwt.logout();
  });

  socket.on("connect", () => {
    console.log("successfully connected with server...");
    store.dispatch(setSocketId(socket.id));
  });

  // Private Chat
  socket.on("broadcast-user", ({ type, userId }) => {
    switch (type) {
      case "ONLINE":
        store.dispatch(setActiveStatusForUser({ userId, status: 1 }));
        break;
      case "OFFLINE":
        store.dispatch(setActiveStatusForUser({ userId, status: 0 }));
        break;
      default:
        break;
    }
  });

  // chat
  socket.on("message", (data) => {
    store.dispatch(
      addMessage({
        byMe: false,
        message: data.message,
        by: data.by,
      })
    );
    store.dispatch(setTyper(""));
  });

  socket.on("typing", (data) => {
    store.dispatch(setTyper(data));
  });

  socket.on("broadcast", (data) => {
    switch (data.type) {
      case "USERS":
        store.dispatch(setActiveUsers(data.users));
        break;
      default:
        break;
    }
  });
};

export const joinChatRoom = (data) => {
  socket.emit("joinChatRoom", data);
};

export const sendMessage = (data) => {
  socket.emit("message", data);
};

export const sendTypingData = (data) => {
  socket.emit("typing", data);
};

export const logout = () => {
  socket.disconnect();
};
