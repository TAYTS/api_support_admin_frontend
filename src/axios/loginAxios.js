import axios from "axios";

const loginAxios = axios.create({
  baseURL: "http://127.0.0.1:5002",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default loginAxios;
