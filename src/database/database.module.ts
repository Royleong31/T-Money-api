import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessInfo } from '../entities/business-info.entity';
import { User } from '../entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserInfo } from 'src/entities/user-info.entity';

@Module({
  imports: [
    // Whatever changes here may be applicable to the replica datasource module
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        namingStrategy: new SnakeNamingStrategy(),
        url: process.env.DATABASE_URL,
        entities: [User, BusinessInfo, UserInfo],
        timezone: 'Z',
      }),
    }),
  ],
})
export class DatabaseModule {}
