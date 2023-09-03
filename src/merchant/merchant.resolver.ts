import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MerchantService } from './merchant.service';

@Resolver()
export class MerchantResolver {
  constructor(private readonly merchantService: MerchantService) {}

  @Query(() => String)
  hello(): string {
    return 'hi';
  }
}
