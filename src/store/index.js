import { configureStore } from "@reduxjs/toolkit";
import ckReducer from "../Pages/Ckeditor/store/ckSlice";
import chatReducer from "../Pages/Chat/store/chatSlice";
import dashboardSlice from "./dashboardSlice";

export default configureStore({
  reducer: {
    ck: ckReducer,
    dashboard: dashboardSlice,
    chat: chatReducer,
  },
});
