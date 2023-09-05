import { BadRequestException, Injectable } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { MerchantRequestQRArgs } from './args/merchant-request-qr.args';
import { MerchantGetQRDetailsArgs } from './args/merchant-get-qr-details.args';
import { MerchantPayQRArgs } from './args/merchant-pay-qr.args';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';
import { MerchantPaymentStatus } from 'src/enums/merchant-payment-status.enum';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { AccountType } from 'src/auth/enums/accountType.enum';

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
    return this.databaseService.merchantPaymentRepository.findOneByOrFail({
      id: data.id,
    });
  }

  async customerPayQR(
    user: User,
    data: MerchantPayQRArgs,
  ): Promise<MerchantPayment> {
    const merchantPayment = await this.databaseService.dataSource.transaction(
      async (manager) => {
        // TODO: Explicit locking for user and currency
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

    return merchantPayment;
  }
}
