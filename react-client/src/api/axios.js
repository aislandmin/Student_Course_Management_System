import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true //True is required to send HTTPOnly JWT cookies
});

export default api;
