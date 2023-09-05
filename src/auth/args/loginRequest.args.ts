import { ArgsType, Field } from '@nestjs/graphql';
import { AccountType } from '../enums/accountType.enum';

@ArgsType()
export class LoginRequestArgs {
  @Field(() => String)
  usernameOrEmail: string;

  @Field(() => String)
  password: string;

  @Field(() => AccountType)
  accountType: AccountType;
}
