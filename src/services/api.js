import axios from "axios";
import {
  ADMIN_API_BASE_URL,
  ADMIN_APP_URL,
  clearAuthSession,
} from "../utils/auth";

const FALLBACK_BASE_URL = import.meta.env.DEV
  ? "http://127.0.0.1:8000/api/admin"
  : "https://apili.kuydinas.id/api/admin";

const BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL || FALLBACK_BASE_URL;

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuthSession();

      if (typeof window !== "undefined") {
        const loginUrl = new URL("/login", `${ADMIN_APP_URL || window.location.origin}/`);
        window.location.href = loginUrl.toString();
      }
    }

    return Promise.reject(error);
  },
);

export default adminApi;
