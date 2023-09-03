import { ArgsType, Field } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';
import { Currency } from 'src/enums/currency.enum';

@ArgsType()
export class WithdrawArgs {
  @Field(() => Number)
  @IsPositive()
  amount: number;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => String)
  paypalEmail: string;
}
