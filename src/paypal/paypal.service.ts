import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { RequestDepositArgs } from './args/request-deposit.args';
import { ConfirmDepositArgs } from './args/confirm-deposit.args';
import { WithdrawArgs } from './args/withdraw.args';
import { PayPalWithdraw } from 'src/entities/paypal-withdraw.entity';
import { PayPalDeposit } from 'src/entities/paypal-deposit.entity';
import { PayPalStatus } from 'src/enums/paypal-status.enum';
import { HttpService } from '@nestjs/axios';
import qs from 'qs';
import dayjs from 'dayjs';
import { AxiosRequestConfig } from 'axios';

const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com';

const DEPOSIT_REFERENCE_ID = 'DEPOSIT_REFERENCE_ID';
const WITHDRAW_REFERENCE_ID = 'WITHDRAW_REFERENCE_ID';

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function camelCase(obj: Record<any, any>) {
  const newObj: Record<any, any> = {};
  for (const d in obj) {
    if (obj.hasOwnProperty(d)) {
      newObj[
        d.replace(/(\_\w)/g, function (k) {
          return k[1].toUpperCase();
        })
      ] = obj[d];
    }
  }
  return newObj;
}

// TODO: Add Fees
@Injectable()
export class PayPalService {
  authTokenDetails: { token: string; expiresAt: dayjs.Dayjs };

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {
    this.authTokenDetails = null;
  }

  async requestWithdraw(
    user: User,
    data: WithdrawArgs,
  ): Promise<PayPalWithdraw> {
    let withdrawId: string = null;

    try {
      // TODO: Do the locking and transaction in DB for transaction and user and paypal withdraw tables

      const withdraw = this.databaseService.paypalWithdrawRepository.create({
        amount: +data.amount.toFixed(2),
        currency: data.currency,
        userId: user.id,
        status: PayPalStatus.BEFORE_REQUEST,
        paypalPaymentId: null, // null until response from Paypal
      });
      await this.databaseService.paypalWithdrawRepository.save(withdraw);
      withdrawId = withdraw.id;

      const body = JSON.stringify({
        items: [
          {
            receiver: data.paypalEmail,
            amount: {
              currency: data.currency,
              value: data.amount,
            },
            recipient_type: 'EMAIL',
            note: `Withdrawal of ${data.amount.toFixed(2)} ${
              data.currency
            } from T Wallet by ${user.username}`,
            sender_item_id: WITHDRAW_REFERENCE_ID,
          },
        ],
        sender_batch_header: {
          sender_batch_id: withdraw.id,
          email_subject: 'Successful withdrawal!',
          email_message: `Hi ${
            user.username
          },\n\nYou have successfully withdrawn ${data.amount.toFixed(2)} ${
            data.currency
          } from T Wallet.\n\nThank you for using T Wallet!`,
        },
      });

      const config = {
        method: 'post',
        url: `${PAYPAL_API_URL}/v1/payments/payouts`,
        headers: {
          'Content-Type': 'application/json',
          'Paypal-Request-Id': withdraw.id,
        },
        data: body,
      };

      const paypalResponse = await this.makeAuthPaypalRequest(config);
      const paypalPaymentId: string =
        paypalResponse.data.batch_header.payout_batch_id;

      const updateWithdrawal =
        await this.databaseService.paypalWithdrawRepository
          .createQueryBuilder('paypalWithdraw')
          .update({ paypalPaymentId, status: PayPalStatus.PENDING })
          .where({ id: withdrawId })
          .returning('*')
          .execute();

      const paypalWithdraw = camelCase({
        ...updateWithdrawal.raw[0],
      }) as PayPalWithdraw;

      // no await here as it's a background job
      this.confirmWithdrawal(paypalWithdraw);
      return paypalWithdraw;
    } catch (error) {
      console.error(error);
      if (withdrawId) {
        // does not throw error if unable to delete
        // This cleans up the withdraw table if the withdraw is not valid. I don't want to use a transaction here as the async request to PayPal may take a long time
        this.databaseService.paypalWithdrawRepository.delete({
          id: withdrawId,
        });
      }

      throw new BadRequestException('Unable to create PayPal deposit');
    }
  }

  // TODO: Replace with a background job
  async confirmWithdrawal(withdraw: PayPalWithdraw) {
    try {
      const getPayoutStatus = {
        method: 'get',
        url: `${PAYPAL_API_URL}/v1/payments/payouts/${withdraw.paypalPaymentId}`,
        headers: {
          'Content-Type': 'application/json',
          'Paypal-Request-Id': withdraw.id,
        },
      };

      for (let i = 0; i < 5; i++) {
        await sleep(5000);

        const response = await this.makeAuthPaypalRequest(getPayoutStatus);
        const status = response.data.batch_header.batch_status;

        if (status === 'PENDING' || status === 'PROCESSING') {
          continue;
        } else if (status === 'SUCCESS') {
          const fees = Number(response.data.batch_header.fees.value);

          // TODO: Update user balance and set the status in the withdraw table to completed in a transaction
          await this.databaseService.paypalWithdrawRepository
            .createQueryBuilder('paypalWithdraw')
            .update({ status: PayPalStatus.COMPLETED, fees })
            .where({ id: withdraw.id })
            .returning('*')
            .execute();
          return;
        } else if (status === 'DENIED' || status === 'CANCELED') {
          // TODO: Set the status of the withdraw table to failed
          return;
        }
        // Should never reach here as the status should be one of the above
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async confirmDeposit(
    user: User,
    data: ConfirmDepositArgs,
  ): Promise<PayPalDeposit> {
    const config = {
      method: 'get',
      url: `${PAYPAL_API_URL}/v2/checkout/orders/${data.paypalCheckoutId}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const paypalResponse = await this.makeAuthPaypalRequest(config);
    if (paypalResponse.data.status !== 'COMPLETED') {
      throw new BadRequestException('Paypal deposit is not confirmed');
    }

    const fees =
      paypalResponse.data.purchase_units[0].payments.captures[0]
        .seller_receivable_breakdown.net_amount.value;

    const paypalDeposit = await this.databaseService.dataSource.transaction(
      async (manager) => {
        const paypalDepositRepository = manager.getRepository(PayPalDeposit);
        // TODO: Simultaneously create a new transaction to credit this user
        // const transactionRepository = manager.getRepository(Transaction);
        const deposit = await paypalDepositRepository.findOne({
          where: { paypalCheckoutId: data.paypalCheckoutId },
        });

        if (!deposit) {
          throw new BadRequestException('Paypal deposit does not exist');
        }

        deposit.status = PayPalStatus.COMPLETED;
        deposit.fees = Number(fees);

        const updateDeposit = await paypalDepositRepository.save(deposit);

        return updateDeposit;
      },
    );

    return paypalDeposit;
  }

  async requestDeposit(
    user: User,
    data: RequestDepositArgs,
  ): Promise<PayPalDeposit> {
    let depositId: string = null;

    try {
      const deposit = this.databaseService.paypalDepositRepository.create({
        amount: +data.amount.toFixed(2),
        currency: data.currency,
        userId: user.id,
        status: PayPalStatus.BEFORE_REQUEST,
        paypalCheckoutId: null, // null until response from Paypal
      });
      await this.databaseService.paypalDepositRepository.save(deposit);
      depositId = deposit.id;

      const body = JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: DEPOSIT_REFERENCE_ID,
            custom_id: deposit.id,
            description: 'Deposit into T Money',
            amount: {
              currency_code: deposit.currency,
              value: deposit.amount.toFixed(2),
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: 'T Money Pte. Ltd.',
              shipping_preference: 'NO_SHIPPING',
              locale: 'en-US',
              landing_page: 'LOGIN',
              user_action: 'PAY_NOW',
              return_url: 'https://tiktok-hackathon-2023.vercel.app',
              cancel_url: 'https://tiktok-hackathon-2023.vercel.app',
            },
          },
        },
      });

      const config = {
        method: 'post',
        url: `${PAYPAL_API_URL}/v2/checkout/orders`,
        headers: {
          'Content-Type': 'application/json',
          'Paypal-Request-Id': deposit.id,
        },
        data: body,
      };

      const paypalResponse = await this.makeAuthPaypalRequest(config);

      const paypalCheckoutId = paypalResponse.data.id;

      const updateDeposit = await this.databaseService.paypalDepositRepository
        .createQueryBuilder('paypalDeposit')
        .update({ paypalCheckoutId, status: PayPalStatus.PENDING })
        .where({ id: depositId })
        .returning('*')
        .execute();

      const paypalDeposit = camelCase({
        ...updateDeposit.raw[0],
      }) as PayPalDeposit;

      return paypalDeposit;
    } catch (error) {
      // Delete deposit if it exists as the deposit is not valid
      if (depositId) {
        // does not throw error if unable to delete
        this.databaseService.paypalDepositRepository.delete({ id: depositId });
      }

      throw new BadRequestException('Unable to create PayPal deposit');
    }
  }

  // if the access token is invalid, get a new one and retry the request, and cache the new access token
  async makeAuthPaypalRequest(config: AxiosRequestConfig) {
    try {
      const accessToken = await this.getPayPalAuthToken();
      const newConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const paypalResponse = await this.httpService.axiosRef.request(newConfig);
      return paypalResponse;
    } catch (error) {
      if (error.response.status === 401) {
        const newAccessToken = await this.fetchPaypalAccessToken();
        const newConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        const paypalResponse = await this.httpService.axiosRef.request(
          newConfig,
        );
        return paypalResponse;
      }
    }
  }

  // Cache access token. Check that the access token is valid for at least 1 more minute to allow for network latency
  async getPayPalAuthToken(): Promise<string> {
    if (
      this.authTokenDetails &&
      this.authTokenDetails.expiresAt.isAfter(dayjs().add(1, 'minute'))
    ) {
      return this.authTokenDetails.token;
    }

    return this.fetchPaypalAccessToken();
  }

  async fetchPaypalAccessToken(): Promise<string> {
    try {
      const result = await this.httpService.axiosRef.post(
        `${PAYPAL_API_URL}/v1/oauth2/token`,
        qs.stringify({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
            ).toString('base64')}`,
          },
        },
      );

      const expiresAt = dayjs().add(result.data.expires_in, 'second');
      const token = result.data.access_token;
      this.authTokenDetails = { token, expiresAt };

      return result.data.access_token;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Unable to get PayPal access token');
    }
  }
}
