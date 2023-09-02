import { ArgsType, Field } from '@nestjs/graphql';
import { AccountType } from '../enums/accountType.enum';

@ArgsType()
export class LoginArgs {
  @Field(() => String)
  usernameOrEmail: string;

  @Field(() => String)
  password: string;

  @Field(() => AccountType)
  accountType: AccountType;
}
