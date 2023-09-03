import { Field, ObjectType } from '@nestjs/graphql';
import { Transaction } from 'src/entities/transaction.entity';

@ObjectType()
export class TransactionDetails {
  @Field(() => [Transaction])
  transactionsIn: Transaction[];

  @Field(() => [Transaction])
  transactionsOut: Transaction[];
}
