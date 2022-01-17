import { teardown as teardownDevServer } from 'jest-dev-server';

export default async function globalTeardown() {
  await teardownDevServer();
  console.log('global teardown');
  // Your global teardown
}
