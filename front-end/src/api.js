import axios from "axios";
// Create axios instance
export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Attach Authorization header if accessToken is present in localStorage
api.interceptors.request.use(
  (config) => {
    // Try both localStorage and sessionStorage for token
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
