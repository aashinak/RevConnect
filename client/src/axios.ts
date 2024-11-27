// axiosInstance.js
import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL , // Base API URL
 // Timeout for requests
});

// Request interceptor: Attach access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // Replace with your token storage logic
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized (token expiration)
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if everything is fine
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and no retry attempt, try refreshing the token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/auth/refresh", { refreshToken });

        // Save the new access token to localStorage
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refreshing fails, redirect to login page
        console.error("Token refresh failed, logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login page or trigger logout flow
        window.location.href = "/login";
      }
    }

    // If it's another error (not 401), just reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
