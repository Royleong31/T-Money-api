import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { AccountType } from 'src/auth/enums/accountType.enum';
import { LowerCaseTransformer } from 'src/transformers/lowercase.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserInfo } from './user-info.entity';
import { BusinessInfo } from './business-info.entity';
import { Balance } from 'src/objectTypes/balance';
import { OwnerOnly } from 'src/middlewares/authorisation.middleware';

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  @Field()
  username: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column({ unique: true, transformer: new LowerCaseTransformer() })
  @OwnerOnly()
  email: string;

  // These 2 fields are used for email verification, and are not used as of now
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true, type: 'timestamptz' })
  @OwnerOnly()
  emailVerificationSentAt?: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  @OwnerOnly()
  emailVerified: boolean;

  // TODO: Many of the fields should be hidden from the non-users. Like a merchant should not be able to see the balances of the user
  @Column({ default: 0 })
  otpCounter: number;

  @Column()
  otpSecret: string;

  @Column({ nullable: true, type: 'timestamptz' })
  otpSentDate?: Date;

  @Column({ type: 'int', default: 0 })
  failedOtpAttempts: number;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  @Field(() => AccountType)
  @OwnerOnly()
  accountType: AccountType;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.user)
  @Field(() => UserInfo)
  @OwnerOnly()
  userInfo: UserInfo;

  @OneToOne(() => BusinessInfo, (businessInfo) => businessInfo.user)
  @Field(() => BusinessInfo, { nullable: true })
  @OwnerOnly()
  businessInfo?: BusinessInfo;

  // Calculated from transactions table
  @Field(() => [Balance])
  @OwnerOnly()
  balances: Balance[];

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  @OwnerOnly()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  @OwnerOnly()
  createdAt: Date;
}
