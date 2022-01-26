// # sourceMappingURL=profile.js.map
require('dotenv').config();

import middy from '@middy/core';
import * as middlewares from '../middlewares';

export const profileCreate = middy(async (event: middlewares.Event) => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profilesGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileUpdate = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileRemove = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);
