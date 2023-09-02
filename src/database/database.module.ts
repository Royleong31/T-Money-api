import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessInfo } from '../entities/business-info.entity';
import { User } from '../entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserInfo } from 'src/entities/user-info.entity';
import { DatabaseService } from './database.service';
import { TypeOrmExModule } from 'src/typeorm/TypeOrmEx.module';
import { UserRepository } from 'src/repositories/user.repository';
import { UserInfoRepository } from 'src/repositories/user-info.repository';
import { BusinessInfoRepository } from 'src/repositories/business-info.repository';

const typeormEntities = TypeOrmModule.forFeature([
  User,
  BusinessInfo,
  UserInfo,
]);

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
    typeormEntities,
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserInfoRepository,
      BusinessInfoRepository,
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
