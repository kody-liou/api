// # sourceMappingURL=profile.js.map
require('dotenv').config();

import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';

export const profileCreate = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(httpErrorHandler());

export const profileGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(httpErrorHandler());

export const profilesGet = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(httpErrorHandler());

export const profileUpdate = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(httpErrorHandler());

export const profileRemove = middy(async () => {
  return {
    statusCode: 200,
    body: '',
  };
}).use(httpErrorHandler());
