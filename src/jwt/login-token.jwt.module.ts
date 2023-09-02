import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const LOGIN_JWT_PROVIDER = 'LoginTokenJwtService';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_LOGIN_TOKEN_SECRET_KEY,
        issuer: 't-money',
        signOptions: {
          expiresIn: '1h',
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
      provide: LOGIN_JWT_PROVIDER,
      useExisting: JwtService,
    },
  ],
  exports: [LOGIN_JWT_PROVIDER],
})
export class LoginTokenJwtModule {}
