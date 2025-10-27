import api, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason: unknown) => void;
};

type RegisterInterceptTokenManagerProps = {
  logOut: () => void;
};

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (
    data: RegisterInterceptTokenManagerProps,
  ) => () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const axios = api.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json, */*',
    'Content-Type': 'application/json',
  },
}) as APIInstanceProps;

let isRefreshing = false;
let failedQueue: PromiseType[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

axios.registerInterceptTokenManager = ({ logOut }) => {
  const intercept = axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      const status = error?.response?.status;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        isRefreshing = true;
        try {
          const refresh_token = await AsyncStorage.getItem('refresh_token');
          const resp = await axios.post('/auth/refresh', {}, {
            headers: {
              "Authorization": `Bearer ${refresh_token}`
            }
          });

          const { access_token, refresh_token: newRefreshToken } = resp.data;

          if (access_token) await AsyncStorage.setItem('access_token', access_token);
          if (newRefreshToken) await AsyncStorage.setItem('refresh_token', newRefreshToken);

          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

          processQueue(null, access_token);

          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (err) {
          processQueue(err, null);
          logOut();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return () => axios.interceptors.response.eject(intercept);
};

axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));

export { axios };