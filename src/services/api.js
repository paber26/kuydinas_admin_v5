import axios from "axios";

const api = axios.create({
  // baseURL: "https://backend.kuydinas.id/api",
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
});

// Interceptor (optional, buat token auth)
api.interceptors.request.use((config) => {
  // contoh mengambil token dari localStorage
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
