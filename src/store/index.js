import { configureStore } from "@reduxjs/toolkit";
import ckReducer from "../Pages/Ckeditor/store/ckSlice";
import chatReducer from "../Pages/Chat/store/chatSlice";
import dashboardSlice from "./dashboardSlice";
import authReducer from "../Pages/Auth/store/authSlice";
import privateChatReducer from "../Pages/PrivateChat/store/privateChatSlice";
import sidebarReducer from "../Components/Slidebar/store/sidebarSlice";

export default configureStore({
  reducer: {
    ck: ckReducer,
    dashboard: dashboardSlice,
    chat: chatReducer,
    auth: authReducer,
    privateChat: privateChatReducer,
    sidebar: sidebarReducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware({
      serializableCheck: false,
    }),
});
