import constants from "../constants";

import axios from "axios";

export default axios.create({
  baseURL: constants.API_URL,
});
