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
export class PayPalWithdraw {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string; // Used as idempotent id in paypal payout both in the Paypal-Request-Id header, and the in the sender_batch_id

  @Index()
  @Field(() => String)
  @Column()
  paypalPaymentId: string; // payout id from paypal, used for querying for the status of the payout

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
