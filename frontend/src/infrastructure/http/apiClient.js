import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL &&
      String(import.meta.env.VITE_API_BASE_URL).trim()) ||
    "http://localhost:8080",
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  },
);
