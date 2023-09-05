import { registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
  // Major coins
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
