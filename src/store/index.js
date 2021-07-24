import { configureStore } from "@reduxjs/toolkit";
import ckSlice from "../Pages/Ckeditor/store/ckSlice";
import dashboardSlice from "./dashboardSlice";

export default configureStore({
  reducer: {
    ck: ckSlice,
    dashboard: dashboardSlice,
  },
});
