import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { TransactionSummaryArgs } from './args/transaction-summary.args';
import { Between, LessThan, MoreThan } from 'typeorm';
import { TransactionDetails } from 'src/objectTypes/transaction-details';
import { TransactionSummary } from 'src/objectTypes/transaction-summary';
import dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTransactionsSummary(
    user: User,
    data: TransactionSummaryArgs,
  ): Promise<TransactionSummary> {
    const { transactionsIn, transactionsOut } = await this.getTransactions(
      user,
      data,
    );

    return {
      amountIn: transactionsIn.reduce((acc, curr) => acc + +curr.amount, 0),
      amountOut: transactionsOut.reduce((acc, curr) => acc + +curr.amount, 0),
    };
  }

  async getTransactions(
    user: User,
    data: TransactionSummaryArgs,
  ): Promise<TransactionDetails> {
    if (dayjs(data.fromDate).isAfter(dayjs(data.toDate))) {
      throw new BadRequestException('fromDate must be before toDate');
    }

    let createdAt = Between(data.fromDate, data.toDate);

    if (!data.fromDate && !data.toDate) {
      createdAt = undefined;
    } else if (!data.toDate) {
      createdAt = MoreThan(data.fromDate);
    } else if (!data.fromDate) {
      createdAt = LessThan(data.toDate);
    }

    const transactionsIn =
      await this.databaseService.transactionRepository.find({
        where: {
          userId: user.id,
          createdAt,
          currency: data.currency,
          amount: MoreThan(0),
        },
        order: {
          createdAt: data.sortOrder,
        },
      });

    const transactionsOut =
      await this.databaseService.transactionRepository.find({
        where: {
          userId: user.id,
          createdAt,
          currency: data.currency,
          amount: LessThan(0),
        },
        order: {
          createdAt: data.sortOrder,
        },
      });

    return {
      transactionsIn,
      transactionsOut,
    };
  }
}
