import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/entities/user.entity';
import { MakeInternalTransferArgs } from './args/make-internal-transfer.args';
import { InternalTransfer } from 'src/entities/internal-transfer.entity';
import { TransactionType } from 'src/enums/transaction-type.enum';
import { getTransactionLockString } from 'src/utils/getTransactionLockString';

@Injectable()
export class IntenalTransferService {
  constructor(private readonly databaseService: DatabaseService) {}

  async makeInternalTransfer(
    user: User,
    data: MakeInternalTransferArgs,
  ): Promise<InternalTransfer> {
    const receiver = await this.databaseService.userRepository.findOne({
      where: { username: data.toUsername },
    });

    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }

    const internalTransfer = this.databaseService.dataSource.transaction(
      async (manager) => {
        const transactionRepository = manager.withRepository(
          this.databaseService.transactionRepository,
        );
        const lockAcquired = await transactionRepository.acquireLock(
          getTransactionLockString(user.id, data.currency),
        );

        if (!lockAcquired) {
          throw new BadRequestException(
            'Concurrent request error, please retry',
          );
        }

        const internalTransferRepository = manager.withRepository(
          this.databaseService.internalTransferRepository,
        );

        const payeeBalance = await transactionRepository.getUserBalance(
          user.id,
          data.currency,
        );

        if (payeeBalance < data.amount) {
          throw new BadRequestException('Insufficient balance');
        }

        const internalTransfer = internalTransferRepository.create({
          senderId: user.id,
          amount: data.amount,
          currency: data.currency,
          receiverId: receiver.id,
          note: data.note,
        });

        await manager.save(internalTransfer);

        const senderTransaction = transactionRepository.create({
          userId: user.id,
          currency: data.currency,
          amount: -data.amount,
          type: TransactionType.INTERNAL_TRANSFER_SENT,
          internalTransferId: internalTransfer.id,
        });

        await manager.save(senderTransaction);

        const receiverTransaction = transactionRepository.create({
          userId: receiver.id,
          currency: data.currency,
          amount: data.amount,
          type: TransactionType.INTERNAL_TRANSFER_RECEIVED,
          internalTransferId: internalTransfer.id,
        });

        await manager.save(receiverTransaction);

        return internalTransfer;
      },
    );

    return internalTransfer;
  }
}
