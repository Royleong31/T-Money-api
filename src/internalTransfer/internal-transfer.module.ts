import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { InternalTransferResolver } from './internal-transfer.resolver';
import { IntenalTransferService } from './internal-transfer.service';

@Module({
  imports: [DatabaseModule],
  providers: [IntenalTransferService, InternalTransferResolver],
  exports: [],
})
export class InternalTransferModule {}
