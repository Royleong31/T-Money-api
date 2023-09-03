import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MerchantService } from './merchant.service';
import { MerchantResolver } from './merchant.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [MerchantService, MerchantResolver],
  exports: [],
})
export class MerchantModule {}
