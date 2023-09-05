import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterBusinessArgs } from './args/register-business.args';
import { AuthPayload } from './payload/auth.payload';
import { AuthService } from './auth.service';
import { RegisterIndividualArgs } from './args/register-individual.args';
import { LoginRequestArgs } from './args/loginRequest.args';
import { LoginRequestPayload } from './payload/loginRequest.payload';
import { LoginArgs } from './args/login.args';

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
}
