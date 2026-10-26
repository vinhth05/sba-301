import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data && typeof error.response.data === 'string') {
        message = error.response.data;
      } else {
        message = `Server error (${error.response.status}): ${error.response.statusText}`;
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Please verify Spring Boot API is running on port 8080.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
