import { Currency } from 'src/enums/currency.enum';

export const getTransactionLockString = (
  userId: string,
  currency: Currency,
) => {
  return `transaction-${userId}-${currency}`;
};
