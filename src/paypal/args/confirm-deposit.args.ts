import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ConfirmDepositArgs {
  @Field(() => String)
  depositId: string; // id of the paypal order, obtained from paypal. Contained in PayPalOrder table
}
