import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const RequestUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const req = gqlContext.req;
      return req?.user || null;
    }

    const req = context.switchToHttp().getRequest();
    return req?.user || null;
  },
);
