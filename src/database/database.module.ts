import { Module } from '@nestjs/common';
import { databaseProviders } from 'db-config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
