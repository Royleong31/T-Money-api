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
    const auth = this.reflector.get<boolean>(
      AUTH_GUARD_KEY,
      context.getHandler(),
    );

    if (!auth) {
      return true;
    }

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

    if (!accessToken) {
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

    throw new UnauthorizedException('UNAUTHENTICATED');
  }
}
