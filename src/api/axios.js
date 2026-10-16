import axios from "axios";

// The UI calls the API directly; the API allows this origin with CORS (backend app.js)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

// AuthContext registers a function here to log the user out when the session expires
let onUnauthorized = null;
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// Attach the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// These endpoints answer 401 for a wrong password, not for an expired session
const PASSWORD_CHECK_URLS = ["/auth/login", "/auth/change-password"];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !PASSWORD_CHECK_URLS.includes(url)) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// Read the "message" sent by the backend's errorHandler
export const getErrorMessage = (error) => {
  if (!error.response) return "Cannot reach the server. Is the API running?";
  return error.response.data?.message || "Something went wrong. Please try again.";
};

export default api;
