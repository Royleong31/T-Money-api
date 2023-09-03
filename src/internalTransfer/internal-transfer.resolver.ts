import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IntenalTransferService } from './internal-transfer.service';
import { DatabaseService } from 'src/database/database.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { InternalTransfer } from 'src/entities/internal-transfer.entity';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { User } from 'src/entities/user.entity';
import { MakeInternalTransferArgs } from './args/make-internal-transfer.args';

@Resolver()
export class InternalTransferResolver {
  constructor(
    private readonly internalTransferService: IntenalTransferService,
    private readonly databaseService: DatabaseService,
  ) {}

  // used when the user clicks on the paypal button
  @Auth()
  @Mutation(() => InternalTransfer)
  makeInternalTransfer(
    @RequestUser() user: User,
    @Args({ type: () => MakeInternalTransferArgs })
    data: MakeInternalTransferArgs,
  ): Promise<InternalTransfer> {
    return this.internalTransferService.makeInternalTransfer(user, data);
  }
}
