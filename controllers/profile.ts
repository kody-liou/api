// # sourceMappingURL=profile.js.map
require('dotenv').config();

import middy from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';
import * as middlewares from '../middlewares';
import { dataFilter } from '../services/profile';

export const profileCreate = middy(
  async (event: middlewares.Event): Promise<APIGatewayProxyResult> => {
    const editable = dataFilter(event.body);
    return {
      statusCode: 200,
      body: JSON.stringify(editable),
    };
  },
).use(middlewares.default);

export const profileGet = middy(async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}).use(middlewares.default);

export const profilesGet = middy(async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify([]),
  };
}).use(middlewares.default);

export const profileUpdate = middy(async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(middlewares.default);

export const profileRemove = middy(async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'Deleted',
  };
}).use(middlewares.default);
