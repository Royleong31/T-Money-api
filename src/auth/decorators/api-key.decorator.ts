import { SetMetadata } from '@nestjs/common';

export const API_KEY_GUARD_KEY = 'api-key';

export const ApiKey = () => SetMetadata(API_KEY_GUARD_KEY, true);
