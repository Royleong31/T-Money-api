import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { PaypalModule } from './paypal/paypal.module';
import { MerchantModule } from './merchant/merchant.module';
import { InternalTransferModule } from './internalTransfer/internal-transfer.module';

@Module({
  imports: [
    DatabaseModule,
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      debug: false,
      playground: false,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    PaypalModule,
    MerchantModule,
    InternalTransferModule,
    MerchantModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
