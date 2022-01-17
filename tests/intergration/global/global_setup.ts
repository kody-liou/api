require('dotenv').config();

import { setup as setupDevServer } from 'jest-dev-server';

export default async function globalSetup() {
  if (
    process.env.API_BASE_URL?.includes('localhost') &&
    process.env.RUN_DEV === 'true'
  ) {
    console.log('global setup');
    await setupDevServer({
      command: `kill-port 7070 && serverless offline --httpPort=7070`,
      launchTimeout: 50000,
      port: 7070,
    });
  }
}
