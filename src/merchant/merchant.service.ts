import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { MerchantRequestQRArgs } from './args/merchant-request-qr.args';
import { MerchantGetQRDetailsArgs } from './args/merchant-get-qr-details.args';
import { MerchantPayQRArgs } from './args/merchant-pay-qr.args';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';
import { MerchantPaymentStatus } from 'src/enums/merchant-payment-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { AccountType } from 'src/auth/enums/accountType.enum';
import { getTransactionLockString } from 'src/utils/getTransactionLockString';

@Injectable()
export class MerchantService {
  constructor(private readonly databaseService: DatabaseService) {}

  async requestQR(
    merchant: User,
    data: MerchantRequestQRArgs,
  ): Promise<MerchantPayment> {
    if (merchant.accountType !== AccountType.BUSINESS) {
      throw new BadRequestException('Only business accounts can request QR');
    }

    const merchantPayment =
      this.databaseService.merchantPaymentRepository.create({
        orderId: data.orderId,
        merchantId: merchant.id,
        amount: data.amount,
        currency: data.currency,
        merchantPaymentStatus: MerchantPaymentStatus.PENDING,
      });

    const savedMerchantPayment =
      await this.databaseService.merchantPaymentRepository.save(
        merchantPayment,
      );

    if (!savedMerchantPayment) {
      throw new BadRequestException('Failed to save merchant payment');
    }

    return savedMerchantPayment;
  }

  async getQRDetails(
    user: User,
    data: MerchantGetQRDetailsArgs,
  ): Promise<MerchantPayment> {
    const payment =
      await this.databaseService.merchantPaymentRepository.findOne({
        where: {
          id: data.id,
        },
      });

    if (!payment) {
      throw new BadRequestException('Merchant payment not found');
    }

    return payment;
  }

  async customerPayQR(
    user: User,
    data: MerchantPayQRArgs,
  ): Promise<MerchantPayment> {
    const merchantPayment = await this.databaseService.dataSource.transaction(
      async (manager) => {
        const transactionRepository = manager.withRepository(
          this.databaseService.transactionRepository,
        );

        const merchantPaymentRepository = manager.withRepository(
          this.databaseService.merchantPaymentRepository,
        );

        // Can only pay for pending orders
        const merchantPayment = await merchantPaymentRepository.findOne({
          where: {
            id: data.id,
            merchantPaymentStatus: MerchantPaymentStatus.PENDING,
          },
        });

        if (!merchantPayment) {
          throw new BadRequestException('Merchant payment not found');
        }

        const lockAcquired = await transactionRepository.acquireLock(
          getTransactionLockString(user.id, merchantPayment.currency),
        );

        if (!lockAcquired) {
          throw new BadRequestException(
            'Concurrent request error, please retry',
          );
        }

        const userBalance = await transactionRepository.getUserBalance(
          user.id,
          merchantPayment.currency,
        );

        if (userBalance < merchantPayment.amount) {
          throw new BadRequestException('Insufficient balance');
        }

        const sendPaymentTrxn = transactionRepository.create({
          userId: user.id,
          currency: merchantPayment.currency,
          amount: -merchantPayment.amount,
          type: TransactionType.MERCHANT_PAYMENT_SENT,
          merchantPaymentId: merchantPayment.id,
        });
        await manager.save(sendPaymentTrxn);

        const receivePaymentTrxn = transactionRepository.create({
          userId: merchantPayment.merchantId,
          currency: merchantPayment.currency,
          amount: merchantPayment.amount,
          type: TransactionType.MERCHANT_PAYMENT_RECEIVED,
          merchantPaymentId: merchantPayment.id,
        });
        await manager.save(receivePaymentTrxn);

        merchantPayment.merchantPaymentStatus = MerchantPaymentStatus.COMPLETED;
        merchantPayment.customerId = user.id;
        await manager.save(merchantPayment);

        return merchantPayment;
      },
    );

    // TODO: Create a background job to notify the merchant that the payment has been received, body needs to be signed with a secret key that is only known to the merchant and the server

    return merchantPayment;
  }
}
