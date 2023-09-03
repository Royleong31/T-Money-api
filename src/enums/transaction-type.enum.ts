import { registerEnumType } from '@nestjs/graphql';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  INTERNAL_TRANSFER_SENT = 'INTERNAL_TRANSFER_SENT',
  INTERNAL_TRANSFER_RECEIVED = 'INTERNAL_TRANSFER_RECEIVED',
  MERCHANT_PAYMENT_RECEIVED = 'MERCHANT_PAYMENT_RECEIVED',
  MERCHANT_PAYMENT_SENT = 'MERCHANT_PAYMENT_SENT',
  // These 2 are for when the withdrawal request with paypal has failed, so we add the user's balance back
  WITHDRAWAL_REFUND = 'WITHDRAWAL_REFUND',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
