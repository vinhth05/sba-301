import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor to normalize error message if needed
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Keep error details for component handling
    return Promise.reject(error);
  }
);

export default axiosClient;
