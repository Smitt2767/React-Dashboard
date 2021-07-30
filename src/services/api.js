import constants from "../constants";
import axios from "axios";

import store from "../store/";
import { setErrorMessage } from "../store/dashboardSlice";
import { logout } from "./jwtService";

const API = axios.create({
  baseURL: constants.API_URL,
});

API.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (!err.response) {
      logout();
      store.dispatch(setErrorMessage("Network Error"));
    }
    if (
      err.response &&
      err.response.status === 401 &&
      err.response.data.error &&
      err.response.data.error.name === "TokenExpiredError"
    ) {
      logout();
      store.dispatch(setErrorMessage("Token expired login again"));
      return;
    }
    throw err;
  }
);

export default API;
