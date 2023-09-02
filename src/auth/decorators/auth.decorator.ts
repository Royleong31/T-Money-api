import { SetMetadata } from '@nestjs/common';

export const AUTH_GUARD_KEY = 'auth';

export const Auth = () => SetMetadata(AUTH_GUARD_KEY, true);
