import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { PaypalModule } from './paypal/paypal.module';
import { MerchantModule } from './merchant/merchant.module';
import { InternalTransferModule } from './internalTransfer/internal-transfer.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { exposeFieldGroupMiddleware } from './middlewares/authorisation.middleware';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      debug: false,
      buildSchemaOptions: {
        fieldMiddleware: [exposeFieldGroupMiddleware],
      },
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
    SendgridModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
