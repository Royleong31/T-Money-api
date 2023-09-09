import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { Transaction } from 'src/entities/transaction.entity';
import { Currency } from 'src/enums/currency.enum';
import { Balance } from 'src/objectTypes/balance';
import { RepositoryWithLock } from './repository-with-lock.repository';

// Exclusive locks needs to be acquired whenever a user's balance is deducted to avoid negative balances
// A lock is acquired by calling the acquireLock method of the RepositoryWithLock class
// There's no possibility of negative balances when a user's balance is incremented
@CustomRepository(Transaction)
export class TransactionRepository extends RepositoryWithLock<Transaction> {
  // get the user's balance for this currency
  async getUserBalance(userId: string, currency: Currency): Promise<number> {
    const queryBuilder = this.createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'amount')
      .where({ userId })
      .andWhere({ currency });

    const balance = await queryBuilder.getRawOne();
    return Number(balance.amount);
  }

  // get the user's balance for all currencies
  async getUserBalances(userId: string): Promise<Balance[]> {
    const queryBuilder = this.createQueryBuilder('transaction')
      .select('SUM(transaction.amount)', 'amount')
      .addSelect('currency')
      .groupBy('currency')
      .where({ userId });

    const balances: { amount: string; currency: Currency }[] =
      await queryBuilder.getRawMany();

    return balances.map((bal) => ({
      amount: +bal.amount,
      currency: bal.currency,
    }));
  }
}
