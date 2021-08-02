import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/api";
import { setErrorMessage } from "../../../store/dashboardSlice";
import _ from "lodash";
import { sendUserReadMessage } from "../../../services/socket";

const initialState = {
  leftPanel: {
    users: [],
    page: 1,
    limit: 10,
    totalRecords: 0,
    hasMore: false,
  },
  currentUser: null,
  rightPanel: {
    messages: [],
    hasMore: false,
    page: 1,
    limit: 10,
    totalRecords: 0,
    hasMessages: true,
    newMessageCome: false,
    isTyping: false,
  },
  showRightPanel: false,
};

export const getUsers = createAsyncThunk(
  "privateChat/getUsers",
  async ({ page, limit }, { dispatch, rejectWithValue }) => {
    try {
      const res = await API.get("/users", {
        params: {
          page: page,
          limit: limit,
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

export const privateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
    clearLeftPanel: (state, action) => {
      state.leftPanel.users = initialState.leftPanel.users;
      state.leftPanel.totalRecords = initialState.leftPanel.totalRecords;
      state.leftPanel.hasMore = initialState.leftPanel.hasMore;
      state.leftPanel.page = initialState.leftPanel.page;
      state.leftPanel.limit = initialState.leftPanel.limit;
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
    },

    addMessageToUser: (state, action) => {
      if (
        !!state.currentUser &&
        (state.currentUser.user_id === action.payload.to_user ||
          state.currentUser.user_id === action.payload.from_user)
      ) {
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
      }
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
    deleteMessageFromCurrentUserMessages: (state, action) => {
      state.rightPanel.messages = state.rightPanel.messages.filter(
        (message) => message.message_id !== action.payload
      );
      state.rightPanel.totalRecords -= 1;
    },
    updateMessageInCurrentUserMessages: (state, action) => {
      console.log(action.payload);
      state.rightPanel.messages.forEach((message) => {
        if (message.message_id === action.payload.messageId) {
          message.text = action.payload.message;
          message.isEdited = 1;
        }
      });
    },
  },

  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      state.leftPanel.users = [
        ...state.leftPanel.users,
        ...action.payload.data,
      ];
      state.leftPanel.totalRecords = action.payload.totalRecords;
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
    [getUsers.rejected]: (state, action) => {},
    [getUserMessages.rejected]: (state, action) => {},
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
  deleteMessageFromCurrentUserMessages,
  updateMessageInCurrentUserMessages,
} = privateChatSlice.actions;

export default privateChatSlice.reducer;
