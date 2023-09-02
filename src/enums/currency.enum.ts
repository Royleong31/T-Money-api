import { registerEnumType } from '@nestjs/graphql';

export enum Currency {
  // Major coins
  USD = 'USD',
  SGD = 'SGD',
}

registerEnumType(Currency, {
  name: 'Currency',
});
