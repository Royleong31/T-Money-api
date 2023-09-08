import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { AuthService, JwtType } from '../auth.service';
import { AUTH_GUARD_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const throwIfUnauthenticated = this.reflector.get<boolean>(
      AUTH_GUARD_KEY,
      context.getHandler(),
    );

    let req: any;
    let accessToken: string;

    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      req = gqlContext.req;
      accessToken = gqlContext?.connectionParams?.authorization;
    } else {
      req = context.switchToHttp().getRequest();
    }

    if (!accessToken && req?.headers?.authorization) {
      accessToken = req?.headers?.authorization.split(' ').pop();
    }

    if (!accessToken && throwIfUnauthenticated) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }

    const user = await this.authService.getUserFromAuthToken(
      accessToken,
      JwtType.ACCESS_TOKEN,
    );

    if (user) {
      req.user = user;
      return true;
    }

    if (throwIfUnauthenticated) {
      throw new UnauthorizedException('UNAUTHENTICATED');
    }
    return true;
  }
}
