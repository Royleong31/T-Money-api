import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { API_KEY_GUARD_KEY } from '../decorators/api-key.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const throwIfUnauthenticated = this.reflector.get<boolean>(
      API_KEY_GUARD_KEY,
      context.getHandler(),
    );

    let req: any;
    let apiKey: string;

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      req = gqlContext.req;
      apiKey = gqlContext?.connectionParams?.authorization;
    } else {
      req = context.switchToHttp().getRequest();
    }

    if (!apiKey && req?.headers?.authorization) {
      apiKey = req?.headers?.authorization.split(' ').pop();
    }

    if (!apiKey && throwIfUnauthenticated) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }

    const user = await this.authService.getUserFromApiKey(apiKey);

    if (user) {
      req.apiKeyUser = user;
      return true;
    }

    if (throwIfUnauthenticated) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }
    return true;
  }
}
