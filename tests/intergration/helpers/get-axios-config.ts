require('dotenv').config();

import type { AxiosRequestConfig } from 'axios';

export const getAxiosConfig = (tokenStr: string): AxiosRequestConfig => {
  const TEST_URL =
    process.env.RUN_DEV === 'true'
      ? process.env.LOCAL_API_BASE_URL
      : process.env.API_BASE_URL;
  console.log('Test url is:', TEST_URL);
  return {
    baseURL: TEST_URL,
    timeout: 30000000,
    headers: { Authorization: `Bearer ${tokenStr}` },
  };
};
