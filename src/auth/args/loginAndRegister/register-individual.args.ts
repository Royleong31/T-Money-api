import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, isEmail } from 'class-validator';

@ArgsType()
export class RegisterIndividualArgs {
  @Field(() => String)
  username: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  // TODO: Add validation for dateOfBirth. Needs to be in the past and in the format of DD-MM-YYYY format
  @Field(() => String)
  dateOfBirth: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  postcode: string;

  @Field(() => String)
  occupation: string;
}
