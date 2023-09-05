import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class LoginArgs {
  @Field(() => String)
  loginToken: string;

  @Field(() => String)
  otp: string;
}
