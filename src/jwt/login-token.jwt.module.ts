import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const LOGIN_TOKEN_JWT_PROVIDER = 'LOGIN_TOKEN_JWT_PROVIDER';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.LOGIN_TOKEN_SECRET_KEY,
        issuer: 't-money',
        signOptions: {
          expiresIn: '30m',
          algorithm: 'HS256',
        },
        verifyOptions: {
          ignoreExpiration: false,
          algorithms: ['HS256'],
        },
      }),
    }),
  ],
  providers: [
    {
      provide: LOGIN_TOKEN_JWT_PROVIDER,
      useExisting: JwtService,
    },
  ],
  exports: [LOGIN_TOKEN_JWT_PROVIDER],
})
export class LoginTokenJwtModule {}
