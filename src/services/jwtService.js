import store from "../store";
import { setAuthData, resetAuthData } from "../Pages/Auth/store/authSlice";
import { resetChatData } from "../Pages/Chat/store/chatSlice";
import API from "./api";
import { leaveChatRoom } from "./socket";

export const logout = () => {
  if (window) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  API.defaults.headers.common["Authorization"] = "";
  leaveChatRoom();
  store.dispatch(resetAuthData());
  store.dispatch(resetChatData());
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
      email: user.email,
      isAuth: !!getDataFromLocalStorage(),
    })
  );
  cb();
};
