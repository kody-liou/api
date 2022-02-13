require('dotenv').config();

import type { AxiosRequestConfig } from 'axios';

export const getAxiosConfig = (tokenStr: string): AxiosRequestConfig => {
  return {
    baseURL: process.env.API_BASE_URL,
    timeout: 30000000,
    headers: { Authorization: `Bearer ${tokenStr}` },
  };
};
