// import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
// import { QueuesModule } from './queues/queues.module';

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

    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     createClient: () =>
    //       new Redis(configService.get('QUEUE_REDIS_URL'), {
    //         maxRetriesPerRequest: null,
    //         enableReadyCheck: false,
    //       }),
    //   }),
    //   inject: [ConfigService],
    // }),

    // QueuesModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
