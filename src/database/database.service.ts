import { Injectable } from '@nestjs/common';
import { ApiKeyRepository } from 'src/repositories/api-key.repository';
import { BusinessInfoRepository } from 'src/repositories/business-info.repository';
import { InternalTransferRepository } from 'src/repositories/internal-transfer.repository';
import { MerchantPaymentRepository } from 'src/repositories/merchant-payment.repository';
import { PayPalDepositRepository } from 'src/repositories/paypal-deposit.repository';
import { PayPalWithdrawRepository } from 'src/repositories/paypal-withdraw.repository';
import { TransactionRepository } from 'src/repositories/transaction.repository';
import { UserInfoRepository } from 'src/repositories/user-info.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    public readonly dataSource: DataSource,
    public readonly userRepository: UserRepository,
    public readonly userInfoRepository: UserInfoRepository,
    public readonly businessInfoRepository: BusinessInfoRepository,
    public readonly paypalDepositRepository: PayPalDepositRepository,
    public readonly paypalWithdrawRepository: PayPalWithdrawRepository,
    public readonly transactionRepository: TransactionRepository,
    public readonly merchantPaymentRepository: MerchantPaymentRepository,
    public readonly internalTransferRepository: InternalTransferRepository,
    public readonly apiKeyRepository: ApiKeyRepository,
  ) {}
}
