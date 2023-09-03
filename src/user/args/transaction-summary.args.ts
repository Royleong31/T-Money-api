import { ArgsType, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Currency } from 'src/enums/currency.enum';

@ArgsType()
export class TransactionSummaryArgs {
  @Field(() => GraphQLISODateTime)
  fromDate: Date;

  @Field(() => GraphQLISODateTime)
  toDate: Date;

  @Field(() => Currency)
  currency: Currency;
}
