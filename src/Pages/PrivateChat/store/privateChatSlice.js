import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/api";
import { setErrorMessage } from "../../../store/dashboardSlice";

const initialState = {
  leftPanel: {
    users: [],
    page: 1,
    limit: 10,
    totalRecords: 0,
    hasMore: true,
  },
};

export const getUsers = createAsyncThunk(
  "privateChat/getUsers",
  async ({ page, limit }, { dispatch, rejectWithValue }) => {
    console.log();
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
export const getUser = createAsyncThunk(
  "privateChat/getUser",
  async (search, { dispatch, rejectWithValue }) => {
    try {
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
    setLeftPanelHasMore: (state, action) => {
      state.leftPanel.hasMore = action.payload;
    },
    setLeftPanelPage: (state, action) => {
      state.leftPanel.page = action.payload;
    },
    setActiveStatusForUser: (state, action) => {
      state.leftPanel.users.forEach((user) => {
        if (user && user.user_id === action.payload.userId) {
          user.active = action.payload.status;
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
    [getUsers.rejected]: (state, action) => {},
  },
});

export const {
  clearLeftPanel,
  setLeftPanelHasMore,
  setLeftPanelPage,
  setActiveStatusForUser,
} = privateChatSlice.actions;

export default privateChatSlice.reducer;
