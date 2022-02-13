// # sourceMappingURL=authenticator.js.map
import jwtDecode from 'jwt-decode';
import type middy from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type AuthEvent = {
  authedUserId: string;
};

type Event = AuthEvent & APIGatewayProxyEvent;

export default (): middy.MiddlewareObj<Event, APIGatewayProxyResult> => {
  const before: middy.MiddlewareFn<Event, APIGatewayProxyResult> = async (
    request,
  ): Promise<APIGatewayProxyResult | void> => {
    try {
      const { event } = request;
      let sub: string;
      const authText =
        event.headers.Authorization || event.headers.authorization;
      if (process.env.SKIP_AUTH && authText) {
        const decodedToken = jwtDecode<{ sub: string }>(authText);
        sub = decodedToken.sub;
      } else {
        sub = event.requestContext.authorizer?.lambda?.sub;
        if (!sub) {
          console.log(
            'No sub, event.requestContext.authorizer?.lambda is:',
            event.requestContext.authorizer?.lambda,
          );
          return { statusCode: 403, body: 'No sub' };
        }
      }
      const userId = event.pathParameters?.userId || sub;
      if (!userId) {
        console.log('No userId, event is:', event);
        return { statusCode: 403, body: 'No userId' };
      }
      if (userId !== sub) {
        console.log('userId no equal to sub, event is:', event);
        return { statusCode: 403, body: 'userId no equal to sub' };
      }
      event.authedUserId = userId;
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        body: error,
      };
    }
  };
  return {
    before,
  };
};
