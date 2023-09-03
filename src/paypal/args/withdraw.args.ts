import { ArgsType, Field } from '@nestjs/graphql';
import { Currency } from 'src/enums/currency.enum';

@ArgsType()
export class WithdrawArgs {
  @Field(() => Number)
  amount: number;

  @Field(() => Currency)
  currency: Currency;
}
