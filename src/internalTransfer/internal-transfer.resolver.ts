import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IntenalTransferService } from './internal-transfer.service';

@Resolver()
export class InternalTransferResolver {
  constructor(
    private readonly internalTransferServicez: IntenalTransferService,
  ) {}

  @Query(() => String)
  hello(): string {
    return 'hi';
  }
}
