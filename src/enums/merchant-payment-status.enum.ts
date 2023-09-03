import { registerEnumType } from '@nestjs/graphql';

export enum MerchantPaymentStatus {
  PENDING = 'PENDING', // after the merchant requests a payment QR code from us
  COMPLETED = 'COMPLETED', // after the user pays the merchant
  EXPIRED = 'EXPIRED', // After merchant payment order has not been fulfilled after a set amount of time. To be set via cron job
}

registerEnumType(MerchantPaymentStatus, {
  name: 'MerchantPaymentStatus',
});
