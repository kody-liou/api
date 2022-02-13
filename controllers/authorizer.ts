// # sourceMappingURL=auth.js.map
require('dotenv').config();

import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import type { APIGatewayEvent } from 'aws-lambda';
import { firebaseAdmin } from '../helpers/gcp';

const generatePolicy = (principalId: string, methodArn: string) => {
  const apiGatewayWildcard = `${methodArn.split('/', 2).join('/')}/*`;
  const authResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
  return authResponse;
};

export default middy(
  async (
    event: APIGatewayEvent & {
      routeArn: string;
    },
  ) => {
    if (!event.headers.authorization) {
      console.log('No authorization in headers, event is');
      console.log(event);
      throw new Error('Unauthorized');
    }
    const tokenParts = event.headers.authorization.split(' ');
    const tokenValue = tokenParts[1];
    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
      throw new Error('Unauthorized');
    }
    const decodedToken = await firebaseAdmin().auth().verifyIdToken(tokenValue);
    const { sub, email } = decodedToken;
    if (!sub || !email) {
      throw new Error('Unauthorized');
    }
    const policy = generatePolicy(sub, event.routeArn);
    return {
      ...policy,
      context: {
        sub,
      },
    };
  },
)
  .use(httpErrorHandler())
  .use(httpEventNormalizer());
