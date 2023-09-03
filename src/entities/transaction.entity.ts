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
import { IsPositive } from 'class-validator';
import { PayPalDeposit } from './paypal-deposit.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { PayPalWithdraw } from './paypal-withdraw.entity';
import { InternalTransfer } from './internal-transfer.entity';
import { MerchantPayment } from './merchant-payment.entity';

@ObjectType()
@Entity()
export class Transaction {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Currency)
  @Column()
  currency: Currency;

  @Field(() => Number)
  @IsPositive()
  @Column({ type: 'numeric' })
  amount: number;

  @Field(() => TransactionType)
  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ nullable: true })
  internalTransferId?: string;

  // Both payer and payee will have the same internalTransferId
  @ManyToOne(
    () => InternalTransfer,
    (internalTransfer) => internalTransfer.transactions,
  )
  @JoinColumn()
  internalTransfer?: InternalTransfer;

  @Column({ nullable: true })
  paypalDepositId?: string;

  @OneToOne(() => PayPalDeposit, (paypalDeposit) => paypalDeposit.transaction)
  @JoinColumn()
  paypalDeposit?: PayPalDeposit;

  @Column({ nullable: true })
  paypalWithdrawalId?: string;

  @OneToOne(
    () => PayPalWithdraw,
    (paypalWithdraw) => paypalWithdraw.transaction,
  )
  @JoinColumn()
  paypalWithdrawal?: PayPalWithdraw;

  // Both customer and merchant will have the same merchantPaymentId
  @Column({ nullable: true })
  merchantPaymentId?: string;

  @ManyToOne(
    () => MerchantPayment,
    (merchantPayment) => merchantPayment.transactions,
  )
  @JoinColumn()
  merchantPayment?: MerchantPayment;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
