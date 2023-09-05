import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginRequestPayload {
  @Field(() => String)
  loginToken: string;
}
