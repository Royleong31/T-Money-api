import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LoginTokenJwtModule } from 'src/jwt/login-token.jwt.module';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { BusinessInfo } from 'src/entities/business-info.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [DatabaseModule, LoginTokenJwtModule],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
