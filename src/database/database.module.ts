import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from 'db-config';
import { BusinessInfo } from 'src/entities/business-info.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BusinessInfo, BusinessInfo, User]),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
