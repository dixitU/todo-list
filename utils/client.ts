import axios, {AxiosResponse} from 'axios';

import {API_BASE_URL} from './constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '@/apis/login';

type Response = AxiosResponse<
  | {
      success: boolean;
      data: any;
      errorMessage?: string;
    }
  | undefined
  | null
>;

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    isPlayStore: false, // @Todo make this value true when create the prod build
    // 'api-key': 'fvnptpsx',
  },
});

const allowedEndPoint = [
  '/v1/auth/login',
  '/v1/auth/signup',
  '/v1/generateAccess',
]

client.interceptors.request.use(async (config: any) => {
  const controller = new AbortController();
  const value = await AsyncStorage.getItem('accessToken');
  if (value) {
    config.headers.authorization = `Bearer ${value}`;
  } else if(!allowedEndPoint.includes(config.url)) {
    controller.abort();
  }
  return {
    ...config,
    signal: controller.signal
  };
});

client.interceptors.response.use(
  response => {
    // console.log('####--------------inside response on interceptor------------- ', device, response.config.baseURL, response.config.url)
    // console.log('--------------end of response interceptor-------------', JSON.stringify(requestArray))
    // console.log('axios response', response.request._retry)
    if (response.data) {
      const {success, data, errorMessage} = response.data;
      // console.log('----- Response data: -----', data)
      if (success === true) {
        response.data = data;
      }

      if (success === false) {
        response.status = 500;
        return Promise.reject(new Error(errorMessage));
      }
    }
    return response;
  },
  async error => {
    console.log(
      '####--------------Response Error: inside error on interceptor-------------',
      error?.config?.baseURL,
      error?.config?.url,
      error?.config,
    );
    console.log(error.response.status);
    const originalRequest = error.config; // save original request to be retried later
    if (
      error?.response?.status === 403 &&
      error?.config?.url === '/v1/generateAccess'
    ) {
      console.log('----- Logout device -----');
      await AsyncStorage.clear()
    } else if (
      (error?.response?.status === 401 ||
        error?.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // Access token is expired, attempt to refresh access token
      try {
        const value = await AsyncStorage.getItem('refreshToken');
        // restrict the refreshToken api call using count
        if(value) {
          const res = await getAccessToken(value);
          if (res) {
            // console.log('res in getAccess', res, '------------------------------**********--------------------')
            const aT = res.accessToken;
            // console.log('@@@@ ---- new Token ---> ', accessToken, refreshToken)
            // accessTokenRef.current = aT;
            // currentUser.setNewAccessToken(aT);
            await AsyncStorage.setItem('accessToken', aT);
            // await setPersistedAuthToken(aT, rT);

            // retry original state
            // console.log('@@@@ ---- before originalRequest ---> ', originalRequest)
            originalRequest._retry = true;
            originalRequest.headers.Authorization = 'Bearer ' + aT;
            originalRequest.authorization = 'Bearer ' + aT;
            return client(originalRequest);
          }
        }
        // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
      } catch (error: any) {
        console.error('error in refresh token', error?.response.data);
        await AsyncStorage.clear();
      }
    } else {
      const errorMessage = 'Something went wrong';
      console.log(error?.status, 'error in intercep');
      if(error.response.status === 500 && error?.config?.url === '/v1/generateAccess') {
        await AsyncStorage.clear();
      }
    }
    return Promise.resolve(error);
  },
);

export default client;
