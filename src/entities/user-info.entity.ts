import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class UserInfo {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  // TODO: Add validation for dateOfBirth. Needs to be in the past and in the format of DD-MM-YYYY format
  @Field(() => String)
  @Column()
  dateOfBirth: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => String)
  @Column()
  postcode: string;

  @Field(() => String)
  @Column()
  occupation: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.userInfo)
  @JoinColumn()
  user: User;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn()
  createdAt: Date;
}
