/**
 * Axios instance + interceptors + fetcher.
 *
 * - baseURL comes from `CONFIG.serverUrl` (app.json → `extra.serverUrl`).
 * - Request interceptor injects `Authorization` from the in-process token cache
 *   (`getCachedToken`) — sync read, no Keychain round-trip per request.
 * - Response interceptor handles 401 via a single-flight refresh with a queue;
 *   on refresh failure it calls `clearSession()` from `src/auth/session.ts`
 *   to clear secure-storage + jotai user atom, so guards react immediately.
 */

import { CONFIG } from 'src/global-config';
import { clearSession } from 'src/auth/session';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { SECURE_KEYS, getCachedToken, secureStorage, setCachedToken } from './secure-storage';

// ----------------------------------------------------------------------

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

function processQueue(error: Error | null, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use((config) => {
  const token = getCachedToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await secureStorage.getItem(SECURE_KEYS.refreshToken);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Bare axios call — bypasses this instance's interceptor to avoid recursion.
      const { data } = await axios.post<{ accessToken: string; refreshToken?: string }>(
        `${CONFIG.serverUrl}${endpoints.auth.refresh}`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } = data;
      if (!accessToken) {
        throw new Error('Refresh response missing accessToken');
      }

      setCachedToken(accessToken);
      await secureStorage.setItem(SECURE_KEYS.accessToken, accessToken);
      if (newRefreshToken) {
        await secureStorage.setItem(SECURE_KEYS.refreshToken, newRefreshToken);
      }

      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      await clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (error) {
    if (__DEV__) console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    refresh: '/api/auth/refresh',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
} as const;
