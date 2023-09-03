import { User } from 'src/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { DatabaseService } from 'src/database/database.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PayPalService } from './paypal.service';
import { ConfirmDepositArgs } from './args/confirm-deposit.args';
import { RequestDepositArgs } from './args/request-deposit.args';
import { WithdrawArgs } from './args/withdraw.args';
import { PayPalDeposit } from 'src/entities/paypal-deposit.entity';
import { PayPalWithdraw } from 'src/entities/paypal-withdraw.entity';

@Resolver()
export class PayPalResolver {
  constructor(
    private readonly paypalService: PayPalService,
    private readonly databaseService: DatabaseService,
  ) {}

  // used when the user clicks on the paypal button
  @Auth()
  @Mutation(() => PayPalDeposit)
  requestDeposit(
    @RequestUser() user: User,
    @Args({ type: () => RequestDepositArgs })
    data: RequestDepositArgs,
  ): Promise<PayPalDeposit> {
    return this.paypalService.requestDeposit(user, data);
  }

  // used upon successful paypal payment. Check against paypal to see if the payment is valid
  @Auth()
  @Mutation(() => PayPalDeposit)
  confirmDeposit(
    @RequestUser() user: User,
    @Args({ type: () => ConfirmDepositArgs })
    data: ConfirmDepositArgs,
  ): Promise<PayPalDeposit> {
    return this.paypalService.confirmDeposit(user, data);
  }

  // send the money to the user's paypal account via paypal payment from our business account
  @Auth()
  @Mutation(() => PayPalWithdraw)
  withdraw(
    @RequestUser() user: User,
    @Args({ type: () => WithdrawArgs })
    data: WithdrawArgs,
  ): Promise<PayPalWithdraw> {
    return this.paypalService.withdraw(user, data);
  }
}
