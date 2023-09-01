import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';

@Module({
  // imports: [TokenModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
