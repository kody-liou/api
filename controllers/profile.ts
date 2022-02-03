// # sourceMappingURL=profile.js.map
import dotenv from 'dotenv';

dotenv.config();
import middy from '@middy/core';
import * as middlewares from '../middlewares';
import { dataFilter } from '../services/profile';

export const profileCreate = middy(async (event: middlewares.Event) => {
  const editable = dataFilter(event.body);
  return {
    statusCode: 400,
    body: editable,
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
