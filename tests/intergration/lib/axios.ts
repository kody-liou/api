require('dotenv').config();

import axios from 'axios';

/**
 *  "sub": "test_user_001",
    "name": "Test User 001",
    "iat": 1516239022
 */
const testUseEncodedJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMDAxIiwibmFtZSI6IlRlc3QgVXNlciAwMDEiLCJpYXQiOjE1MTYyMzkwMjJ9.zeN6BaFiZXLKys2lkTuS9tABkZFWIywq9C6msCA54mI';
export default axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000000,
  headers: { Authorization: `Bearer ${testUseEncodedJWT}` },
});

export const testUserId = 'test_user_001';
