import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const ACCESS_TOKEN_JWT_PROVIDER = 'ACCESS_TOKEN_JWT_PROVIDER';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        issuer: 't-money',
        signOptions: {
          expiresIn: '30d',
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
      provide: ACCESS_TOKEN_JWT_PROVIDER,
      useExisting: JwtService,
    },
  ],
  exports: [ACCESS_TOKEN_JWT_PROVIDER],
})
export class AccessTokenJwtModule {}
