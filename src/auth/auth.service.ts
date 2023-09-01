import { Injectable } from '@nestjs/common';
import { RegisterIndividualArgs } from './args/register-individual.args';
import { LoginArgs } from './args/login.args';
import { AuthPayload } from './payload/auth.payload';
import { RegisterBusinessArgs } from './args/register-business.args';

@Injectable()
export class AuthService {
  async registerBusiness(data: RegisterBusinessArgs): Promise<AuthPayload> {
    return {
      accessToken: 'access token',
      refreshToken: 'refresh token',
    };
  }

  async registerIndividual(data: RegisterIndividualArgs): Promise<AuthPayload> {
    return {
      accessToken: 'access token',
      refreshToken: 'refresh token',
    };
  }

  async login(data: LoginArgs): Promise<AuthPayload> {
    return {
      accessToken: data.accountType,
      refreshToken: data.usernameOrEmail,
    };
  }
}
