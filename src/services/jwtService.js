import store from "../store";
import { setAuthData, resetAuthData } from "../Pages/Auth/store/authSlice";
import { resetChatData } from "../Pages/Chat/store/chatSlice";

export const removeLocalStorage = (cb) => {
  if (window) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  store.dispatch(resetAuthData());
  store.dispatch(resetChatData());
  cb();
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
