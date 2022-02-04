import dotenv from 'dotenv';

dotenv.config();
import axios from 'axios';
import { testUseEncodedJWT } from './constants.js';
/**
 *  "sub": "test_user_001",
    "name": "Test User 001",
    "iat": 1516239022
 */

export default axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000000,
  headers: { Authorization: `Bearer ${testUseEncodedJWT}` },
});
