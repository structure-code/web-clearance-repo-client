import axios from 'axios';

// 1. Base Axios Instance Configuration
export const apiClient = axios.create({
  baseURL: 'https://api.web-clearance.workfromanywhere.name.ng/api/v1',
  withCredentials: true,
  timeout: 10000, // 10-second timeout to prevent requests from hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Token Refresh Queue State
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// 3. Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Safety Guard A: Handle standard Request Timeouts / Network Failures safely
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error("Network timeout or server unreachable.");
      return Promise.reject(error);
    }

    // Safety Guard B: Exclude specific endpoints from token-refresh cycles
    const isLoginRequest = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/login');
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

    if (isLoginRequest || isRefreshRequest) {
      // Pass the 401 straight to the UI component (e.g., to show "Invalid credentials")
      return Promise.reject(error);
    }

    // 4. Handle legitimate token expiration 401s for protected endpoints
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If a refresh is already in progress, queue up subsequent requests
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a clean, standard axios instance to call the refresh token endpoint.
        // This isolates the request so it cannot re-trigger its own interceptor loop.
        await axios.post(
          'https://api.web-clearance.workfromanywhere.name.ng/api/v1/auth/refresh',
          {},
          { withCredentials: true, timeout: 10000 }
        );
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        
        // Notify the AuthContext to instantly clear user state and shut down loaders
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);