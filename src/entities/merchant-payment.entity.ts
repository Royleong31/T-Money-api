import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Currency } from 'src/enums/currency.enum';
import { Transaction } from './transaction.entity';
import { MerchantPaymentStatus } from 'src/enums/merchant-payment-status.enum';

@ObjectType()
@Entity()
@Unique(['orderId', 'merchantId']) // idempotency guarantee
export class MerchantPayment {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string; // used in the qr code that user scans

  @Field(() => String)
  @Column()
  orderId: string; // idempotent id from merchant

  @Field(() => String, { nullable: true })
  @Index()
  @Column({ nullable: true })
  customerId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User, { nullable: true })
  customer: User; // from

  @Field(() => String)
  @Index()
  @Column()
  merchantId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User, { nullable: true })
  merchant: User; // to

  @Field(() => Number)
  @Column({ type: 'numeric' })
  amount: number;

  @Field(() => Currency)
  @Column()
  currency: Currency;

  @Field(() => MerchantPaymentStatus)
  @Column()
  merchantPaymentStatus: MerchantPaymentStatus;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  createdAt: Date;
}
