import axios from "axios";

const instance = axios.create({
  baseURL: "http://i8b303.p.ssafy.io",
});

export default instance;
