import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { Transaction } from 'src/entities/transaction.entity';

@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {}
