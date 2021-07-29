import socketIoClient from "socket.io-client";
import constants from "../constants";
import store from "../store";
import {
  setSocketId,
  addMessage,
  setTyper,
  setActiveUsers,
} from "../Pages/Chat/store/chatSlice";
let socket;

export const connectWithWebSocket = () => {
  socket = socketIoClient(constants.API_URL);

  socket.on("connect", () => {
    console.log("successfully connected with server...");
    store.dispatch(setSocketId(socket.id));
  });

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
