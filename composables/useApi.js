import axios from 'axios';

export const useApi = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase || 'http://localhost:7000/api/v1',
    timeout: 10000,
  });

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      if (authStore.isAuthenticated) {
        config.headers.Authorization = `Bearer ${useCookie('access_token').value}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle response errors and token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and we haven't tried to refresh token yet
      if (error.response?.status === 401 && !originalRequest._retry && authStore.isAuthenticated) {
        originalRequest._retry = true;

        try {
          const success = await authStore.refreshAccessToken();
          if (success) {
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${useCookie('access_token').value}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh failed, logout and redirect
          authStore.logout();
          navigateTo('/auth/login');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
