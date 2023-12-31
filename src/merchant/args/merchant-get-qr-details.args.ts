import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class MerchantGetQRDetailsArgs {
  @Field(() => String)
  id: string; // id generated by us
}
