import { Field, ObjectType } from '@nestjs/graphql';
import { ApiKeyType } from 'src/enums/permission.enum';

@ObjectType()
export class ApiKeyPayload {
  @Field(() => String)
  apiKey: string;

  @Field(() => String)
  label: string;

  @Field(() => String)
  merchantId: string;

  @Field(() => ApiKeyType)
  type: ApiKeyType;

  @Field(() => String)
  prefix: string;

  // TODO: add webhook url and signing with secret for authentication
  // @Field(() => String)
  // webhookUrl: string;
}
