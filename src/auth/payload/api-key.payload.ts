import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ApiKeyPayload {
  @Field(() => String)
  apiKey: string;
}
