import axios from "axios";

// Create a custom axios instance with your backend URL as the base
const axiosInstance = axios.create({
  baseURL: "https://teamboard-pro.onrender.com/api",
});

// Interceptor — runs before every request automatically
// Grabs token from localStorage and attaches it to the Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;