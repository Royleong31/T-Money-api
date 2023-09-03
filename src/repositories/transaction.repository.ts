import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { Transaction } from 'src/entities/transaction.entity';
import BigNumber from 'bignumber.js';
import { Currency } from 'src/enums/currency.enum';
import { Balance } from 'src/objectTypes/balance';

@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
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
