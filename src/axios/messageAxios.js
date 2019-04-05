import axios from "axios";

const messageAxios = axios.create({
  baseURL: "https://userbackend.chocolatepie.tech",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default messageAxios;
