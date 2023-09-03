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

@Injectable()
export class PayPalService {
  authTokenDetails: { token: string; expiresAt: dayjs.Dayjs };

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {
    this.authTokenDetails = null;
  }

  async withdraw(user: User, data: WithdrawArgs): Promise<PayPalWithdraw> {
    throw new Error('Method not implemented.');
  }

  async confirmDeposit(
    user: User,
    data: ConfirmDepositArgs,
  ): Promise<PayPalDeposit> {
    throw new Error('Method not implemented.');
  }

  async createDeposit(
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
              currency_code: data.currency,
              value: data.amount.toFixed(2),
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
      const paypalResponse = await this.makePaypalRequest(config);

      const paypalCheckoutId = paypalResponse.data.id;

      await this.databaseService.paypalDepositRepository.update(
        { id: deposit.id },
        { paypalCheckoutId, status: PayPalStatus.PENDING },
      );

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
  async makePaypalRequest(config: AxiosRequestConfig) {
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
        const accessToken = await this.fetchPaypalAccessToken();
        const newConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
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
