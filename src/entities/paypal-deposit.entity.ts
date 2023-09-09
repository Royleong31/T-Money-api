import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Currency } from 'src/enums/currency.enum';
import { PayPalStatus } from 'src/enums/paypal-status.enum';
import { IsPositive } from 'class-validator';
import { Transaction } from './transaction.entity';

@ObjectType()
@Entity()
export class PayPalDeposit {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string; // Used as idempotent id in paypal checkout, in the Paypal-Request-Id header

  @Index()
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  paypalCheckoutId?: string; // checkout id from paypal, used for querying for the status of the checkout payment

  @Field(() => Currency)
  @Column()
  currency: Currency;

  @Field(() => Number)
  @Column({ type: 'numeric' })
  @IsPositive()
  amount: number;

  @Field(() => String)
  @Column()
  @Index()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Transaction, (transaction) => transaction.paypalDeposit)
  transaction: Transaction;

  // fee paid by us to paypal
  @Field(() => Number, { nullable: true })
  @Column({ type: 'numeric', nullable: true })
  fees: number;

  @Field(() => PayPalStatus)
  @Column()
  status: PayPalStatus;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
