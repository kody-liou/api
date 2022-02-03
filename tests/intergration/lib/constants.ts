export const testUseEncodedJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXJfMDAxIiwibmFtZSI6IlRlc3QgVXNlciAwMDEiLCJpYXQiOjE1MTYyMzkwMjJ9.zeN6BaFiZXLKys2lkTuS9tABkZFWIywq9C6msCA54mI';

export const testUserId = 'test_user_001';
import { Options } from 'got';

export const options = new Options({
  prefixUrl: 'https://httpbin.org',
  headers: {
    foo: 'foo',
  },
});
