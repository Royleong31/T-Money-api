import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

registerEnumType(AccountType, {
  name: 'AccountType',
});
