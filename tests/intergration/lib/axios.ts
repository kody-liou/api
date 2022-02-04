require('dotenv').config();

import type { AxiosRequestConfig } from 'axios';
import { testUseEncodedJWT } from './constants';

export const config: AxiosRequestConfig = {
  baseURL: process.env.API_BASE_URL,
  timeout: 30000000,
  headers: { Authorization: `Bearer ${testUseEncodedJWT}` },
};
