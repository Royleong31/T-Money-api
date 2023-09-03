import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';
import { PayPalService } from './paypal.service';
import { PayPalResolver } from './paypal.resolver';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [PayPalService, PayPalResolver],
  exports: [PayPalService],
})
export class PaypalModule {}
