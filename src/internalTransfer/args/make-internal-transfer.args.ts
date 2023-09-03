import { ArgsType, Field } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';
import { Currency } from 'src/enums/currency.enum';

@ArgsType()
export class MakeInternalTransferArgs {
  @Field(() => Number)
  @IsPositive()
  amount: number;

  @Field(() => Currency)
  currency: Currency;

  // Username of the recipient
  @Field(() => String)
  toUsername: string;

  @Field(() => String)
  note: string;
}
