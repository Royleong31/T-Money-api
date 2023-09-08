import { Field, ObjectType } from '@nestjs/graphql';
import { ApiKeyType } from 'src/enums/permission.enum';

@ObjectType()
export class ApiKeyPayload {
  @Field(() => String)
  label: string;

  @Field(() => String)
  merchantId: string;

  @Field(() => ApiKeyType)
  type: ApiKeyType;

  @Field(() => String)
  prefix: string;

  @Field(() => String)
  webhookUrl: string;
}
