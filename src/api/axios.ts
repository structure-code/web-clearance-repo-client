import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.web-clearance.workfromanywhere.name.ng/api/v1',
  withCredentials: true,
  timeout: 10000, // 10-second timeout to prevent infinite hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle standard Request Timeouts / Network Failures
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error("Network timeout or server unreachable.");
      return Promise.reject(error);
    }

    // Don't intercept 401s coming directly from the refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // FIX: Use standard axios instance (or check endpoint exclusion above) 
        // to prevent the refresh call from re-triggering this interceptor
        await axios.post(
          'https://api.web-clearance.workfromanywhere.name.ng/api/v1/auth/refresh',
          {},
          { withCredentials: true, timeout: 10000 }
        );
        
        processQueue(null);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // Dispatch custom event to clear auth state and break the loader screen
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);