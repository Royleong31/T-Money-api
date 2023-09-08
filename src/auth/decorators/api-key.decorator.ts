import { SetMetadata } from '@nestjs/common';

export const API_KEY_GUARD_KEY = 'api-key';

export const ApiKey = (throwIfUnauthenticated?: boolean) =>
  SetMetadata(API_KEY_GUARD_KEY, throwIfUnauthenticated ?? true);
