import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from 'db-config';
import { BusinessInfo } from '../entities/business-info.entity';
import { User } from '../entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserInfo } from 'src/entities/user-info.entity';

@Module({
  imports: [
    // Whatever changes here may be applicable to the replica datasource module
    TypeOrmModule.forRoot({
      type: 'postgres',
      namingStrategy: new SnakeNamingStrategy(),
      url: process.env.DATABASE_URL,
      username: 'postgres',
      password: 'postgres',
      database: 'tmoney',
      entities: [User, BusinessInfo, UserInfo],
    }),
  ],
})
export class DatabaseModule {}
