import { SetMetadata } from '@nestjs/common';

export const AUTH_GUARD_KEY = 'auth';

// If throwIfUnauthenticated is true, the guard will throw an UnauthorizedException if the user is not authenticated
// If throwIfUnauthenticated is false, the guard will not throw an UnauthorizedException if the user is not authenticated, but will still add req.user to the request object if the user is found with the API key details
export const Auth = (throwIfUnauthenticated?: boolean) =>
  SetMetadata(AUTH_GUARD_KEY, throwIfUnauthenticated ?? true);
