import { ArgsType, Field } from '@nestjs/graphql';
import { Currency } from 'src/enums/currency.enum';

@ArgsType()
export class WithdrawArgs {
  @Field(() => String)
  amount: string;

  @Field(() => Currency)
  currency: Currency;
}
