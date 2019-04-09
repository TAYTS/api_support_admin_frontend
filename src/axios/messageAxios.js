import axios from "axios";

const messageAxios = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default messageAxios;
