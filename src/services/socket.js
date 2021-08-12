import socketIoClient from "socket.io-client";
import constants from "../constants";
import store from "../store";
import { setErrorMessage, setSuccessMessage } from "../store/dashboardSlice";
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
  updateLeftPanelUsersLastMessageAndTotalUnRead,
  addRoomToLeftPanel,
  removeRoomFromRightPanel,
  updateRoomName,
  updateAdmin,
  addMessageToRoom,
  setWhoIsTyping,
  deleteMessageFromRoom,
  updateMessageToRoom,
  updateMessageInLeftPanelLastMessage,
  updateLeftPanelRoomsLastMessage,
  setIsLoading,
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
      if (
        !!!!store.getState().privateChat.currentUser &&
        (store.getState().privateChat.currentUser.user_id === message.to_user ||
          store.getState().privateChat.currentUser.user_id ===
            message.from_user)
      )
        store.dispatch(addMessageToUser(message));
      else {
        store.dispatch(updateLeftPanelUsersLastMessageAndTotalUnRead(message));
      }
      store.dispatch(setIsLoading(false));
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

    socket.on(
      "deleteMessage",
      ({ messageId, senderId, isLast, lastMessage }) => {
        if (
          !!store.getState().privateChat.currentUser &&
          store.getState().privateChat.currentUser.user_id === senderId
        )
          store.dispatch(deleteMessageFromCurrentUserMessages(messageId));
        if (isLast) {
          store.dispatch(
            updateMessageInLeftPanelLastMessage({
              userId: senderId,
              message: lastMessage,
            })
          );
        }
        store.dispatch(setIsLoading(false));
      }
    );

    socket.on("updateMessage", ({ messageId, message, senderId, isLast }) => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === senderId
      ) {
        store.dispatch(
          updateMessageInCurrentUserMessages({ messageId, message })
        );
      }
      if (isLast) {
        store.dispatch(
          updateMessageInLeftPanelLastMessage({ userId: senderId, message })
        );
      }
      store.dispatch(setIsLoading(false));
    });
  });

  // Roomssssss
  socket.on("joinNewRoom", (data) => {
    if (store.getState().privateChat.activeTab === 1)
      store.dispatch(
        addRoomToLeftPanel({
          room_id: data.room_id,
          roomname: data.roomname,
          isAdmin: data.isAdmin,
        })
      );
    store.dispatch(setSuccessMessage(data.message));
    socket.emit("join", data.room_id);
  });

  socket.on("KickedOutFromRoom", (data) => {
    if (store.getState().privateChat.activeTab === 1)
      store.dispatch(removeRoomFromRightPanel(data.room_id));
    store.dispatch(setErrorMessage(data.message));
    socket.emit("leave", data.room_id);
  });

  socket.on("updateRoomName", (data) => {
    if (store.getState().privateChat.activeTab === 1)
      store.dispatch(
        updateRoomName({
          roomId: data.room_id,
          roomname: data.roomname,
        })
      );
  });

  socket.on("updateAdmin", (data) => {
    store.dispatch(setSuccessMessage(data.message));
    if (store.getState().privateChat.activeTab === 1) {
      store.dispatch(updateAdmin(data.room_id));
    }
  });

  socket.on("room_new_message", (data) => {
    if (
      store.getState().privateChat.activeTab === 1 &&
      !!store.getState().privateChat.currentRoom &&
      store.getState().privateChat.currentRoom.room_id === data.roomId
    ) {
      store.dispatch(addMessageToRoom(data.message));
    }
    store.dispatch(
      updateLeftPanelRoomsLastMessage({
        roomId: data.roomId,
        message: data.message.text,
      })
    );
  });

  socket.on("who_is_typing", ({ username, room_id }) => {
    if (
      store.getState().privateChat.activeTab === 1 &&
      !!store.getState().privateChat.currentRoom &&
      store.getState().privateChat.currentRoom.room_id === room_id
    )
      store.dispatch(setWhoIsTyping(username));
  });

  socket.on(
    "deleteRoomMessage",
    ({ message_id, room_id, isLast, last_message }) => {
      if (
        store.getState().privateChat.activeTab === 1 &&
        !!store.getState().privateChat.currentRoom &&
        store.getState().privateChat.currentRoom.room_id === room_id
      )
        store.dispatch(deleteMessageFromRoom(message_id));
      if (isLast) {
        store.dispatch(
          updateLeftPanelRoomsLastMessage({
            roomId: room_id,
            message: last_message,
          })
        );
      }
    }
  );

  socket.on("updateRoomMessage", ({ message_id, room_id, message, isLast }) => {
    if (
      store.getState().privateChat.activeTab === 1 &&
      !!store.getState().privateChat.currentRoom &&
      store.getState().privateChat.currentRoom.room_id === room_id
    )
      store.dispatch(updateMessageToRoom({ message_id, message }));

    if (isLast) {
      store.dispatch(
        updateLeftPanelRoomsLastMessage({ roomId: room_id, message })
      );
    }
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

export const connectWithWebSocket = async () => {
  connectMainIo();
  connectGlobalChatIo();
};

// Private Chat Room
export const sendMessageToUser = (data) => {
  socket.emit("sendMessageToUser", data, (message) => {
    if (
      !!store.getState().privateChat.currentUser &&
      (store.getState().privateChat.currentUser.user_id === message.to_user ||
        store.getState().privateChat.currentUser.user_id === message.from_user)
    )
      store.dispatch(addMessageToUser(message));
    store.dispatch(updateLeftPanelUsersLastMessageAndTotalUnRead(message));
    store.dispatch(setIsLoading(false));
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

export const deleteMessage = (messageId, receiverId, isLast, lastMessage) => {
  socket.emit(
    "deleteMessage",
    { messageId, receiverId, isLast, lastMessage },
    () => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === receiverId
      )
        store.dispatch(deleteMessageFromCurrentUserMessages(messageId));

      if (isLast) {
        store.dispatch(
          updateMessageInLeftPanelLastMessage({
            userId: receiverId,
            message: lastMessage,
          })
        );
      }
      store.dispatch(setIsLoading(false));
    }
  );
};

export const updateMessage = ({ receiverId, message, messageId, isLast }) => {
  socket.emit(
    "updateMessage",
    { receiverId, message, messageId, isLast },
    () => {
      if (
        !!store.getState().privateChat.currentUser &&
        store.getState().privateChat.currentUser.user_id === receiverId
      ) {
        store.dispatch(
          updateMessageInCurrentUserMessages({ messageId, message })
        );
      }
      if (isLast) {
        store.dispatch(
          updateMessageInLeftPanelLastMessage({ userId: receiverId, message })
        );
      }
      store.dispatch(setIsLoading(false));
    }
  );
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

// Roomsssssssss
export const roomNewMessage = (data) => {
  socket.emit("room_new_message", data, (data) => {
    if (
      store.getState().privateChat.activeTab === 1 &&
      store.getState().privateChat.currentRoom.room_id === data.roomId
    ) {
      store.dispatch(addMessageToRoom(data.message));
    }
    store.dispatch(
      updateLeftPanelRoomsLastMessage({
        roomId: data.roomId,
        message: data.message.text,
      })
    );
  });
};

export const sendWhoIsTyoing = (room_id) => {
  socket.emit("who_is_typing", room_id);
};

export const deleteRoomMessage = (
  message_id,
  room_id,
  isLast,
  last_message
) => {
  socket.emit("deleteRoomMessage", {
    message_id,
    room_id,
    isLast,
    last_message,
  });
};

export const updateRoomMessage = (data) => {
  socket.emit("updateRoomMessage", data);
};
