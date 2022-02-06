// # sourceMappingURL=index.js.map
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import * as authenticator from './authenticator';

export type Event = APIGatewayProxyEvent &
  authenticator.AuthEvent & {
    body: { [key: string]: any };
    pathParameters: { [name: string]: string | undefined };
  };

export default [
  httpJsonBodyParser(),
  authenticator.default(),
  httpErrorHandler(),
  httpEventNormalizer(),
];
