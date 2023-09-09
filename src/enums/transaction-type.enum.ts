import { registerEnumType } from '@nestjs/graphql';

// Deduction transactions require a lock to be acquired based on the user's id and currency to prevent concurrency issues
export enum TransactionType {
  DEPOSIT = 'DEPOSIT', // increment
  WITHDRAWAL = 'WITHDRAWAL', // deduction
  INTERNAL_TRANSFER_SENT = 'INTERNAL_TRANSFER_SENT', // deduction
  INTERNAL_TRANSFER_RECEIVED = 'INTERNAL_TRANSFER_RECEIVED', // increment
  MERCHANT_PAYMENT_RECEIVED = 'MERCHANT_PAYMENT_RECEIVED', // increment
  MERCHANT_PAYMENT_SENT = 'MERCHANT_PAYMENT_SENT', // deduction
  // This is for when the withdrawal request with paypal has failed, so we add the user's balance back
  WITHDRAWAL_REFUND = 'WITHDRAWAL_REFUND', // increment
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
});
