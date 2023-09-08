import { ArgsType, Field } from '@nestjs/graphql';
import { ApiKeyType } from 'src/enums/permission.enum';

@ArgsType()
export class GenerateApiKeyArgs {
  // used to identify the api key
  @Field(() => String)
  label: string;

  @Field(() => ApiKeyType)
  type: ApiKeyType;

  @Field(() => String)
  webhookUrl: string;
}
