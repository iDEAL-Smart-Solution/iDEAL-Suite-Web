import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  // Safely handle empty / 204 responses so JSON.parse("") never throws
  transformResponse: [
    (data) => {
      if (typeof data === "string") {
        const trimmed = data.trim();
        if (!trimmed) return null; // 204 / empty body → null
        try {
          return JSON.parse(trimmed);
        } catch {
          return data; // return as‑is if not valid JSON
        }
      }
      return data;
    },
  ],
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ideal_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("ideal_token");
      sessionStorage.removeItem("ideal_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
