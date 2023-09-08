import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const RequestMerchant = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const req = gqlContext.req;
      return req?.apiKeyUser || null;
    }

    const req = context.switchToHttp().getRequest();
    return req?.apiKeyUser || null;
  },
);
