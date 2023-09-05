import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LoginTokenJwtModule } from 'src/jwt/login-token.jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';

@Module({
  imports: [DatabaseModule, LoginTokenJwtModule, SendgridModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthResolver,
    AuthService,
  ],
})
export class AuthModule {}
