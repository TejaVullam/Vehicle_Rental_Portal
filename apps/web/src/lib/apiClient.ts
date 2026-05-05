import axios from "axios";
import { env } from "../env";
import { useAuthStore } from "../store/useAuthStore";

export const apiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_APP_URL}/api`, // Wait, the API runs on port 3001
});

// We should use the API_URL from env, but client-side needs NEXT_PUBLIC
apiClient.defaults.baseURL = "http://localhost:3001/api"; // Hardcoded for now, or env.NEXT_PUBLIC_API_URL

// Interceptor to attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401s (e.g., clear store if token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
