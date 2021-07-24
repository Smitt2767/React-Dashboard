import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
import constants from "../../../constants";
import {
  setSuccessMessage,
  setErrorMessage,
} from "../../../store/dashboardSlice";
axios.defaults.baseURL = constants.API_URL;

const initialState = {
  ckInstances: [
    {
      id: uuidV4(),
      data: "",
    },
  ],
  ckTableData: [],
  editMode: false,
};

export const sendData = createAsyncThunk(
  "ck/sendData",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post("/ck", { data });
      if (res.status) {
        dispatch(setSuccessMessage(res.data.message));
        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  }
);
export const editData = createAsyncThunk(
  "ck/editData",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(`/ck/${data.id}`, { data: data.data });
      if (res.status) {
        dispatch(setSuccessMessage(res.data.message));
        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  }
);

export const getData = createAsyncThunk(
  "ck/getData",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get("/ck");
      if (res.status) {
        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  }
);

export const getDataById = createAsyncThunk(
  "ck/getDataById",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`/ck/${id}`);
      if (res.status) {
        return res.data.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  }
);

export const deleteData = createAsyncThunk(
  "ck/deletedata",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete("/ck", { data });

      if (res.status) {
        dispatch(setSuccessMessage(res.data.message));
        dispatch(removeDataFromTableList(data.id));
        return res.data;
      }
    } catch (e) {
      if (e.response?.data) {
        dispatch(setErrorMessage(e.response?.data.message));
      }
    }
  }
);

export const ckSlice = createSlice({
  name: "ck",
  initialState,
  reducers: {
    addInstance: (state, action) => {
      state.ckInstances.push({
        id: uuidV4(),
        data: "",
      });
    },
    deleteInstance: (state, action) => {
      state.ckInstances = state.ckInstances.filter(
        (ck) => ck.id !== action.payload
      );
    },
    handleCkDataChange: (state, action) => {
      state.ckInstances.forEach((ck) => {
        if (ck.id === action.payload.id) ck.data = action.payload.data;
      });
    },
    removeDataFromTableList: (state, action) => {
      state.ckTableData = state.ckTableData.filter(
        (ck) => ck.id !== action.payload
      );
    },
    setCkInstance: (state, action) => {},
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
  },
  extraReducers: {
    [sendData.fulfilled]: (state, action) => {
      state.ckInstances = initialState.ckInstances;
    },

    [getData.fulfilled]: (state, action) => {
      state.ckTableData = action.payload.data;
    },

    [getDataById.fulfilled]: (state, action) => {
      state.ckInstances = action.payload.data;
    },

    [editData.fulfilled]: (state, action) => {
      state.ckInstances = initialState.ckInstances;
      state.editMode = false;
    },
  },
});

export const {
  addInstance,
  deleteInstance,
  handleCkDataChange,
  removeDataFromTableList,
  setCkInstance,
  setEditMode,
} = ckSlice.actions;

export default ckSlice.reducer;
