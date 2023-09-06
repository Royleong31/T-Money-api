import { registerEnumType } from '@nestjs/graphql';

export enum ApiKeyType {
  CREATE_PAYMENT_QR = 'CREATE_PAYMENT_QR',
}

registerEnumType(ApiKeyType, {
  name: 'ApiKeyType',
});
