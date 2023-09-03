import { Field, ObjectType } from '@nestjs/graphql';
import { Currency } from 'src/enums/currency.enum';

@ObjectType()
export class Balance {
  @Field(() => Number)
  amount: number;

  @Field(() => Currency)
  currency: Currency;
}
