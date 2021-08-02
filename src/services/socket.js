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
import {
  setActiveStatusForUser,
  addMessageToUser,
  setMessageRead,
  updateMessagesRead,
  setIsTyping,
  deleteMessageFromCurrentUserMessages,
  updateMessageInCurrentUserMessages,
} from "../Pages/PrivateChat/store/privateChatSlice";
// import * as jwt from "./jwtService";

let socket;
let globalChatSocket;

const connectMainIo = () => {
  socket = socketIoClient(constants.API_URL, {
    auth: {
      token: JSON.parse(localStorage.getItem("token")),
    },
  });

  socket.on("connect_error", (err) => {
    store.dispatch(setErrorMessage(err.message));
    // jwt.logout();
  });

  socket.on("ERROR", (errMessage) => {
    store.dispatch(setErrorMessage(errMessage));
  });

  socket.on("connect", () => {
    console.log("successfully connected with main socketIo server...");

    // Events
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

    socket.on("sendMessageToUser", (message) => {
      store.dispatch(addMessageToUser({ ...message, by_me: 0 }));
    });

    socket.on("userReadYourMessage", (messageId) => {
      store.dispatch(setMessageRead(messageId));
    });

    socket.on("updateIsRead", (receiverId) => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === receiverId
      )
        store.dispatch(updateMessagesRead());
    });

    socket.on("sendTypingStatus", (senderId) => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === senderId
      ) {
        store.dispatch(setIsTyping(true));
      }
    });

    socket.on("deleteMessage", ({ messageId, senderId }) => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === senderId
      )
        store.dispatch(deleteMessageFromCurrentUserMessages(messageId));
    });

    socket.on("updateMessage", ({ messageId, message, senderId }) => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === senderId
      ) {
        store.dispatch(
          updateMessageInCurrentUserMessages({ messageId, message })
        );
      }
    });
  });
};

const connectGlobalChatIo = () => {
  globalChatSocket = socketIoClient(`${constants.API_URL}/globalChat`);

  globalChatSocket.on("connect", () => {
    console.log("successfully connected with globalChat socketIo server...");
    store.dispatch(setSocketId(globalChatSocket.id));

    globalChatSocket.on("message", (data) => {
      store.dispatch(
        addMessage({
          byMe: false,
          message: data.message,
          by: data.by,
        })
      );
      store.dispatch(setTyper(""));
    });

    globalChatSocket.on("typing", (data) => {
      store.dispatch(setTyper(data));
    });

    globalChatSocket.on("broadcast", (data) => {
      switch (data.type) {
        case "USERS":
          store.dispatch(setActiveUsers(data.users));
          break;
        default:
          break;
      }
    });
  });
};

export const connectWithWebSocket = () => {
  connectMainIo();
  connectGlobalChatIo();
};

// Private Chat Room
export const sendMessageToUser = (data) => {
  socket.emit("sendMessageToUser", data, (message) => {
    store.dispatch(addMessageToUser({ ...message, by_me: 1 }));
  });
};
export const sendUserReadMessage = (messageId, senderId) => {
  socket.emit("messageRead", { messageId, senderId });
};

export const updateMessagesIsReadStatus = (sender_id) => {
  socket.emit("updateIsRead", sender_id);
};

export const sendTypingStatus = (receiver_id) => {
  socket.emit("sendTypingStatus", receiver_id);
};

export const deleteMessage = (messageId, receiverId) => {
  socket.emit("deleteMessage", { messageId, receiverId }, () => {
    if (
      !!store.getState().privateChat.currentUser &&
      store.getState().privateChat.currentUser.user_id === receiverId
    )
      store.dispatch(deleteMessageFromCurrentUserMessages(messageId));
  });
};

export const updateMessage = ({ receiverId, message, messageId }) => {
  socket.emit("updateMessage", { receiverId, message, messageId }, () => {
    if (
      !!store.getState().privateChat.currentUser &&
      store.getState().privateChat.currentUser.user_id === receiverId
    ) {
      store.dispatch(
        updateMessageInCurrentUserMessages({ messageId, message })
      );
    }
  });
};

// Chat room
export const joinChatRoom = (data) => {
  globalChatSocket.emit("joinChatRoom", data);
};

export const sendMessage = (data) => {
  globalChatSocket.emit("message", data);
};

export const sendTypingData = (data) => {
  globalChatSocket.emit("typing", data);
};

export const logout = () => {
  globalChatSocket.disconnect();
  socket.disconnect();
};
