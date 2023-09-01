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

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column({ unique: true, transformer: new LowerCaseTransformer() })
  email: string;

  // These 2 fields are used for email verification, and are not used as of now
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  emailVerificationSentAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ nullable: true })
  emailVerified: boolean;

  @Column({ default: 0 })
  otpCounter: number;

  @Column()
  otpSecret: string = Math.round(Math.random() * 10 ** 16).toString(16);

  @Column({ type: 'int', default: 0 })
  failedOtpAttempts: number;

  @Field(() => AccountType)
  @Column()
  accountType: AccountType;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.userId)
  userInfo: UserInfo;

  @OneToOne(() => BusinessInfo, (businessInfo) => businessInfo.userId)
  businessInfo: BusinessInfo;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
