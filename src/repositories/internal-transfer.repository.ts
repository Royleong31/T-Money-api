import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { InternalTransfer } from 'src/entities/internal-transfer.entity';

@CustomRepository(InternalTransfer)
export class InternalTransferRepository extends Repository<InternalTransfer> {}
