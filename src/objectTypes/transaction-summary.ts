import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionSummary {
  @Field(() => Number)
  amountIn: number;

  @Field(() => Number)
  amountOut: number;
}
