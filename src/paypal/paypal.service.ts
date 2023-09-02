import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { RequestDepositArgs } from './args/request-deposit.args';
import { ConfirmDepositArgs } from './args/confirm-deposit.args';
import { WithdrawArgs } from './args/withdraw.args';
import { PayPalWithdraw } from 'src/entities/paypal-withdraw.entity';
import { PayPalDeposit } from 'src/entities/paypal-deposit.entity';

@Injectable()
export class PayPalService {
  constructor(private readonly databaseService: DatabaseService) {}

  withdraw(user: User, data: WithdrawArgs): Promise<PayPalWithdraw> {
    throw new Error('Method not implemented.');
  }

  confirmDeposit(user: User, data: ConfirmDepositArgs): Promise<PayPalDeposit> {
    throw new Error('Method not implemented.');
  }

  createDeposit(user: User, data: RequestDepositArgs): Promise<PayPalDeposit> {
    throw new Error('Method not implemented.');
  }
}
