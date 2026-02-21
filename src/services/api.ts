import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
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
