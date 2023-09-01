import { ArgsType, Field } from '@nestjs/graphql';
import { AccountType } from '../enums/accountType.enum';
import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@ArgsType()
export class LoginArgs {
  @Field(() => String)
  @MinLength(3)
  usernameOrEmail: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => AccountType)
  @IsNotEmpty()
  accountType: AccountType;
}
