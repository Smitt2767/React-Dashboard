import store from "../store";
import { setAuthData, resetAuthData } from "../Pages/Auth/store/authSlice";
import { resetChatData } from "../Pages/Chat/store/chatSlice";
import { resetPrivateChat } from "../Pages/PrivateChat/store/privateChatSlice";
import API from "./api";
import * as socket from "./socket";

export const logout = () => {
  if (window) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  API.defaults.headers.common["Authorization"] = "";
  socket.logout();
  store.dispatch(resetAuthData());
  store.dispatch(resetChatData());
  store.dispatch(resetPrivateChat());
};

export const setLocalStorage = (key, value) => {
  if (window) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getDataFromLocalStorage = () => {
  if (window) {
    if (localStorage.getItem("user") && localStorage.getItem("token")) {
      return JSON.parse(localStorage.getItem("user"));
    } else {
      return false;
    }
  }
};

export const authenticate = ({ token, user }, cb) => {
  setLocalStorage("user", user);
  setLocalStorage("token", token);
  store.dispatch(
    setAuthData({
      username: user.username,
      isAuth: !!getDataFromLocalStorage(),
    })
  );
  cb();
};
