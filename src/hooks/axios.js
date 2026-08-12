import axios from "axios";
export const api = axios.create({
  baseURL: "https://otaku-hub-pink.vercel.app/",
  timeout: 2000,
});
