import { registerEnumType } from '@nestjs/graphql';

export enum Currency {
  // Major fiat currencies
  USD = 'USD',
  SGD = 'SGD',
}

registerEnumType(Currency, {
  name: 'Currency',
});
