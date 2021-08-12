import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/api";
import { setErrorMessage } from "../../../store/dashboardSlice";
import _ from "lodash";
import { sendUserReadMessage } from "../../../services/socket";
const initialState = {
  activeTab: 0,
  leftPanel: {
    users: [],
    page: 1,
    limit: 10,
    totalRecords: 0,
    hasMore: false,
    hasUsers: true,
    rooms: [],
    hasRooms: true,
  },
  currentUser: null,
  currentRoom: null,
  rightPanel: {
    messages: [],
    hasMore: false,
    page: 1,
    limit: 10,
    totalRecords: 0,
    hasMessages: true,
    newMessageCome: false,
    isTyping: false,
    whoIsTyping: null,
    isLoading: false,
  },
  showRightPanel: false,
  showCreateRoomModal: false,
  showRoomInfoModal: false,
  isRoomEdit: false,
};

export const getUsers = createAsyncThunk(
  "privateChat/getUsers",
  async ({ page, limit, search }, { dispatch, rejectWithValue }) => {
    try {
      const res = await API.get("/users", {
        params: {
          page: page,
          limit: limit,
          search,
        },
      });
      if (res.status) {
        const totalRecords = res.data.totalRecords;
        const currentRecords = page * limit;

        if (totalRecords > currentRecords) dispatch(setLeftPanelHasMore(true));
        else dispatch(setLeftPanelHasMore(false));

        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
      return rejectWithValue({});
    }
  }
);

export const getRooms = createAsyncThunk(
  "privateChat/getRooms",
  async ({ page, limit, search }, { dispatch, rejectWithValue }) => {
    try {
      const res = await API.get("/rooms", {
        params: {
          page: page,
          limit: limit,
          search,
        },
      });
      if (res.status) {
        const totalRecords = res.data.totalRecords;
        const currentRecords = page * limit;
        if (totalRecords > currentRecords) dispatch(setLeftPanelHasMore(true));
        else dispatch(setLeftPanelHasMore(false));

        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
      return rejectWithValue({});
    }
  }
);

export const getUserMessages = createAsyncThunk(
  "privateChat/getUserMessages",
  async ({ page, limit, toUserId }, { dispatch, rejectWithValue }) => {
    try {
      const res = await API.get("/users/messages", {
        params: {
          page,
          limit,
          toUserId,
        },
      });
      if (res.status) {
        const totalRecords = res.data.totalRecords;
        const currentRecords = page * limit;

        if (totalRecords > currentRecords) dispatch(setRightPanelHasMore(true));
        else dispatch(setRightPanelHasMore(false));

        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
      return rejectWithValue({});
    }
  }
);

export const getRoomMessages = createAsyncThunk(
  "privateChat/getRoomMessages",
  async ({ page, limit, room_id }, { dispatch, rejectWithValue }) => {
    try {
      const res = await API.get("/rooms/messages", {
        params: {
          page,
          limit,
          room_id,
        },
      });
      if (res.status) {
        const totalRecords = res.data.totalRecords;
        const currentRecords = page * limit;

        if (totalRecords > currentRecords) dispatch(setRightPanelHasMore(true));
        else dispatch(setRightPanelHasMore(false));

        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
      return rejectWithValue({});
    }
  }
);

export const privateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
    clearLeftPanel: (state, action) => {
      state.currentRoom = initialState.currentRoom;
      state.currentUser = initialState.currentUser;
      state.leftPanel.users = initialState.leftPanel.users;
      state.leftPanel.totalRecords = initialState.leftPanel.totalRecords;
      state.leftPanel.hasMore = initialState.leftPanel.hasMore;
      state.leftPanel.page = initialState.leftPanel.page;
      state.leftPanel.limit = initialState.leftPanel.limit;
      state.leftPanel.rooms = initialState.leftPanel.rooms;
      state.leftPanel.hasUsers = initialState.leftPanel.hasUsers;
      state.leftPanel.hasRooms = initialState.leftPanel.hasRooms;
    },
    clearRightPanel: (state, action) => {
      state.rightPanel.messages = initialState.rightPanel.messages;
      state.rightPanel.totalRecords = initialState.rightPanel.totalRecords;
      state.rightPanel.hasMore = initialState.rightPanel.hasMore;
      state.rightPanel.page = initialState.rightPanel.page;
      state.rightPanel.limit = initialState.rightPanel.limit;
    },
    setLeftPanelHasMore: (state, action) => {
      state.leftPanel.hasMore = action.payload;
    },
    setLeftPanelPage: (state, action) => {
      state.leftPanel.page = action.payload;
    },
    setRightPanelHasMore: (state, action) => {
      state.rightPanel.hasMore = action.payload;
    },
    setRightPanelPage: (state, action) => {
      state.rightPanel.page = action.payload;
    },
    setActiveStatusForUser: (state, action) => {
      state.leftPanel.users.forEach((user) => {
        if (user && user.user_id === action.payload.userId) {
          user.active = action.payload.status;
        }
      });
      if (
        !!state.currentUser &&
        state.currentUser.user_id === action.payload.userId
      ) {
        state.currentUser.active = action.payload.status;
        state.currentUser.last_active = new Date().toISOString();
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      if (
        !!state.leftPanel.users.length &&
        action.payload &&
        !!state.leftPanel.users.find(
          (user) => user.user_id === action.payload.user_id
        )?.totalUnRead
      ) {
        state.leftPanel.users.forEach((user) => {
          if (user.user_id === action.payload.user_id) {
            user.totalUnRead = 0;
          }
        });
      }
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },

    addMessageToUser: (state, action) => {
      state.rightPanel.messages.unshift(action.payload);
      state.rightPanel.totalRecords += 1;
      if (!state.rightPanel.hasMessages) state.rightPanel.hasMessages = true;
      if (!!!action.payload.by_me) {
        sendUserReadMessage(
          action.payload.message_id,
          action.payload.from_user
        );
      }
      state.rightPanel.newMessageCome = true;
    },

    setNewMessageCome: (state, action) => {
      state.rightPanel.rightPanelMessageDiv = action.paylod;
    },
    setShowRightPanel: (state, action) => {
      state.showRightPanel = action.payload;
    },
    setMessageRead: (state, action) => {
      state.rightPanel.messages.forEach((message) => {
        if (message && message.message_id === action.payload) {
          message.isRead = true;
        }
      });
    },
    updateMessagesRead: (state, action) => {
      state.rightPanel.messages.forEach((message) => {
        if (message && !!!message.isRead) {
          message.isRead = true;
        }
      });
    },
    setIsTyping: (state, action) => {
      state.rightPanel.isTyping = action.payload;
    },
    setHasMessage: (state, action) => {
      state.rightPanel.hasMessages = action.payload;
    },
    setHasUsers: (state, action) => {
      state.leftPanel.hasUsers = action.payload;
    },
    deleteMessageFromCurrentUserMessages: (state, action) => {
      state.rightPanel.messages = state.rightPanel.messages.filter(
        (message) => message.message_id !== action.payload
      );
      state.rightPanel.totalRecords -= 1;
    },
    updateMessageInCurrentUserMessages: (state, action) => {
      state.rightPanel.messages.forEach((message) => {
        if (message.message_id === action.payload.messageId) {
          message.text = action.payload.message;
          message.isEdited = 1;
        }
      });
    },
    updateMessageInLeftPanelLastMessage: (state, action) => {
      state.leftPanel.users.forEach((user) => {
        if (user.user_id === action.payload.userId) {
          user.last_message = action.payload.message;
        }
      });
    },
    updateLeftPanelUsersLastMessageAndTotalUnRead: (state, action) => {
      state.leftPanel.users.forEach((user) => {
        if (
          user.user_id === action.payload.from_user ||
          user.user_id === action.payload.to_user
        ) {
          user.last_message = action.payload.text;
        }
        if (user.user_id === action.payload.from_user) {
          user.last_message = action.payload.text;
          user.totalUnRead += 1;
        }
      });
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowCreateRoomModal: (state, action) => {
      state.showCreateRoomModal = action.payload;
    },
    addRoomToLeftPanel: (state, action) => {
      state.leftPanel.rooms.unshift(action.payload);
      state.leftPanel.hasRooms = true;
    },
    removeRoomFromRightPanel: (state, action) => {
      const newData = state.leftPanel.rooms.filter(
        (room) => room.room_id !== action.payload
      );
      state.leftPanel.rooms = newData;

      if (!!state.currentRoom && state.currentRoom.room_id === action.payload) {
        state.currentRoom = null;
      }

      if (state.showRoomInfoModal === true) state.showRoomInfoModal = false;
      state.leftPanel.hasRooms = !!newData.length;
    },
    setShowRoomInfoModal: (state, action) => {
      state.showRoomInfoModal = action.payload;
    },
    handleExitRoom: (state, action) => {
      state.showRightPanel = false;
      const newRoomsList = state.leftPanel.rooms.filter(
        (room) => room.room_id !== state.currentRoom.room_id
      );
      state.leftPanel.rooms = newRoomsList;
      if (!!!newRoomsList.length) state.leftPanel.hasRooms = false;
      state.currentRoom = null;
    },
    setIsRoomEdit: (state, action) => {
      state.isRoomEdit = action.payload;
    },
    updateRoomName: (state, action) => {
      if (
        !!state.currentRoom &&
        state.currentRoom.room_id === action.payload.roomId
      )
        state.currentRoom.roomname = action.payload.roomname;
      state.leftPanel.rooms.forEach((room) => {
        if (room.room_id === action.payload.roomId) {
          room.roomname = action.payload.roomname;
        }
      });
    },
    updateAdmin: (state, action) => {
      state.leftPanel.rooms.forEach((room) => {
        if (room.room_id === action.payload) {
          room.isAdmin = 1;
        }
      });
      if (state.currentRoom && state.currentRoom.room_id === action.payload) {
        state.currentRoom.isAdmin = 1;
      }
    },
    addMessageToRoom: (state, action) => {
      state.rightPanel.messages.unshift(action.payload);
      state.rightPanel.totalRecords += 1;
      if (!state.rightPanel.hasMessages) state.rightPanel.hasMessages = true;
      state.rightPanel.newMessageCome = true;
    },
    setWhoIsTyping: (state, action) => {
      state.rightPanel.whoIsTyping = action.payload;
    },
    deleteMessageFromRoom: (state, action) => {
      state.rightPanel.messages = state.rightPanel.messages.filter(
        (message) => message.message_id !== action.payload
      );
      state.rightPanel.totalRecords -= 1;
    },
    updateMessageToRoom: (state, action) => {
      state.rightPanel.messages.forEach((message) => {
        if (message.message_id === action.payload.message_id) {
          message.isEdited = 1;
          message.text = action.payload.message;
        }
      });
    },
    updateLeftPanelRoomsLastMessage: (state, action) => {
      state.leftPanel.rooms.forEach((room) => {
        if (room.room_id === action.payload.roomId) {
          room.last_message = action.payload.message;
        }
      });
    },
    setIsLoading: (state, action) => {
      state.rightPanel.isLoading = action.payload;
    },
    resetPrivateChat: (state) => initialState,
  },

  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      state.leftPanel.users = [
        ...state.leftPanel.users,
        ...action.payload.data,
      ];
      state.leftPanel.totalRecords = action.payload.totalRecords;
      state.leftPanel.hasUsers = !!action.payload.data.length;
    },
    [getRooms.fulfilled]: (state, action) => {
      state.leftPanel.rooms = [
        ...state.leftPanel.rooms,
        ...action.payload.data,
      ];
      state.leftPanel.totalRecords = action.payload.totalRecords;
      state.leftPanel.hasRooms = !!action.payload.data.length;
    },

    [getUserMessages.fulfilled]: (state, action) => {
      const messages = _.uniq(
        [...state.rightPanel.messages, ...action.payload.data],
        "message_id"
      );
      state.rightPanel.messages = [
        ...state.rightPanel.messages,
        ...action.payload.data,
      ];
      state.rightPanel.hasMessages = !!messages.length;
      state.rightPanel.totalRecords = action.payload.totalRecords;
    },
    [getRoomMessages.fulfilled]: (state, action) => {
      const messages = _.uniq(
        [...state.rightPanel.messages, ...action.payload.data],
        "message_id"
      );
      state.rightPanel.messages = [
        ...state.rightPanel.messages,
        ...action.payload.data,
      ];
      state.rightPanel.hasMessages = !!messages.length;
      state.rightPanel.totalRecords = action.payload.totalRecords;
    },
    [getUsers.rejected]: (state, action) => {},
    [getRooms.rejected]: (state, action) => {},
    [getUserMessages.rejected]: (state, action) => {},
    [getRoomMessages.rejected]: (state, action) => {},
  },
});

export const {
  clearLeftPanel,
  clearRightPanel,
  setLeftPanelHasMore,
  setLeftPanelPage,
  setRightPanelHasMore,
  setRightPanelPage,
  setActiveStatusForUser,
  setCurrentUser,
  addMessageToUser,
  setShowRightPanel,
  setMessageRead,
  updateMessagesRead,
  setNewMessageCome,
  setIsTyping,
  setHasMessage,
  setHasUsers,
  deleteMessageFromCurrentUserMessages,
  updateMessageInCurrentUserMessages,
  updateLeftPanelUsersLastMessageAndTotalUnRead,
  setActiveTab,
  setCurrentRoom,
  setShowCreateRoomModal,
  addRoomToLeftPanel,
  setShowRoomInfoModal,
  handleExitRoom,
  setIsRoomEdit,
  updateRoomName,
  removeRoomFromRightPanel,
  updateAdmin,
  resetPrivateChat,
  addMessageToRoom,
  setWhoIsTyping,
  deleteMessageFromRoom,
  updateMessageToRoom,
  updateMessageInLeftPanelLastMessage,
  updateLeftPanelRoomsLastMessage,
  setIsLoading,
} = privateChatSlice.actions;

export default privateChatSlice.reducer;
