import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create a configured axios instance for API requests
export const createApiClient = (baseURL: string = 'http://localhost:3000/api/v1'): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Only clear the auth data, let the AuthProvider handle the redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();