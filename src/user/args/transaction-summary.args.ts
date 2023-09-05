import { ArgsType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Currency } from 'src/enums/currency.enum';
import { SortOrder } from 'src/enums/sort-order.enum';

@ArgsType()
export class TransactionSummaryArgs {
  @Field(() => GraphQLISODateTime, { nullable: true })
  fromDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  toDate?: Date;

  @Field(() => SortOrder, { defaultValue: SortOrder.DESC })
  sortOrder: SortOrder;

  @Field(() => Currency)
  currency: Currency;
}
