import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Currency } from 'src/enums/currency.enum';
import { Transaction } from './transaction.entity';

@ObjectType()
@Entity()
export class InternalTransfer {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Index()
  @Column()
  senderId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  sender: User; // from

  @Field(() => Number)
  @Column({ type: 'numeric' })
  amount: number;

  @Field(() => Currency)
  @Column()
  currency: Currency;

  @Field(() => String)
  @Index()
  @Column()
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  receiver: User; // to

  @ManyToOne(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @Field(() => String)
  @Column({ default: '' })
  note: string;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt: Date;
}
