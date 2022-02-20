// # sourceMappingURL=profile.js.map
require('dotenv').config();

import middy from '@middy/core';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { AttributeValue } from '@aws-sdk/client-dynamodb';
import * as middlewares from '../middlewares';
import { dataFilter } from '../services/profile';
import {
  createOrUpdateItem,
  DBResourceType,
  CommonDBItem,
} from '../helpers/dynamodb';
import { PartialNull } from '../types/common';

export const profileCreate = middy(
  async (event: middlewares.Event): Promise<APIGatewayProxyResult> => {
    const editable = dataFilter(event.body);
    await createOrUpdateItem({
      userId: event.authedUserId,
      type: DBResourceType.profile,
      data: { a: 1 } as any as PartialNull<CommonDBItem>,
    });
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
