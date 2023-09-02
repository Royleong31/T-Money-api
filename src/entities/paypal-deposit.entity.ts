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

@ObjectType()
@Entity()
export class PayPalDeposit {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string; // Used as idempotent id in paypal checkout, in the Paypal-Request-Id header

  @Index()
  @Field(() => String)
  @Column()
  paypalCheckoutId: string; // checkout id from paypal, used for querying for the status of the checkout payment

  @Field(() => Currency)
  @Column()
  currency: Currency;

  @Field(() => Number)
  @Column({ type: 'numeric' })
  amount: number;

  @Field(() => String)
  @Column()
  @Index()
  userId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  // fee paid by us to paypal
  @Field(() => String)
  @Column()
  fees: string;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
