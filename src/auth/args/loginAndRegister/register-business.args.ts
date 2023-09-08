import { ArgsType, Field } from '@nestjs/graphql';
import { RegisterIndividualArgs } from './register-individual.args';

@ArgsType()
export class RegisterBusinessArgs extends RegisterIndividualArgs {
  @Field(() => String)
  businessName: string;

  @Field(() => String)
  uen: string;

  @Field(() => String)
  businessCountry: string;

  @Field(() => String)
  businessPostcode: string;

  @Field(() => String)
  businessAddress: string;
}
