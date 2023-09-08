import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterBusinessArgs } from './args/loginAndRegister/register-business.args';
import { AuthPayload } from './payload/auth.payload';
import { AuthService } from './auth.service';
import { RegisterIndividualArgs } from './args/loginAndRegister/register-individual.args';
import { LoginRequestArgs } from './args/loginAndRegister/loginRequest.args';
import { LoginRequestPayload } from './payload/loginRequest.payload';
import { LoginArgs } from './args/loginAndRegister/login.args';
import { GenerateApiKeyArgs } from './args/apiKey/generate-api-keys.args';
import { ApiKeyPayload } from './payload/api-key.payload';
import { Auth } from './decorators/auth.decorator';
import { User } from 'src/entities/user.entity';
import { RequestUser } from './decorators/request-user.decorator';
import { AccountType } from './enums/accountType.enum';
import { BadRequestException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  hello(): string {
    return 'hi';
  }

  @Mutation(() => AuthPayload)
  registerBusiness(
    @Args({ type: () => RegisterBusinessArgs })
    data: RegisterBusinessArgs,
  ): Promise<AuthPayload> {
    return this.authService.registerBusiness(data);
  }

  @Mutation(() => AuthPayload)
  registerIndividual(
    @Args({ type: () => RegisterIndividualArgs })
    data: RegisterBusinessArgs,
  ): Promise<AuthPayload> {
    return this.authService.registerIndividual(data);
  }

  @Mutation(() => LoginRequestPayload)
  loginRequest(
    @Args({ type: () => LoginRequestArgs })
    data: LoginRequestArgs,
  ): Promise<LoginRequestPayload> {
    return this.authService.loginRequest(data);
  }

  @Mutation(() => AuthPayload)
  login(
    @Args({ type: () => LoginArgs })
    data: LoginArgs,
  ): Promise<AuthPayload> {
    return this.authService.login(data);
  }

  // Everything below involves creating, getting, and revoking api keys
  @Mutation(() => String)
  @Auth()
  generateApiKey(
    @RequestUser() user: User,
    @Args({ type: () => GenerateApiKeyArgs })
    data: GenerateApiKeyArgs,
  ): Promise<string> {
    if (user.accountType !== AccountType.BUSINESS) {
      throw new BadRequestException('Not Business account');
    }

    return this.authService.generateApiKey(user, data);
  }

  @Query(() => [ApiKeyPayload])
  @Auth()
  getApiKeyList(@RequestUser() user: User): Promise<ApiKeyPayload[]> {
    if (user.accountType !== AccountType.BUSINESS) {
      throw new BadRequestException('Not Business account');
    }

    return this.authService.getApiKeyList(user.id);
  }

  @Mutation(() => Boolean)
  @Auth()
  revokeApiKey(
    @RequestUser() user: User,
    @Args('prefix', { type: () => String })
    prefix: string,
  ): Promise<boolean> {
    if (user.accountType !== AccountType.BUSINESS) {
      throw new BadRequestException('Not Business account');
    }

    return this.authService.revokeApiKey(user.id, prefix);
  }
}
