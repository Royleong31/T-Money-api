import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessInfo } from '../entities/business-info.entity';
import { User } from '../entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserInfo } from 'src/entities/user-info.entity';
import { DatabaseService } from './database.service';
import { TypeOrmExModule } from 'src/typeorm/TypeOrmEx.module';
import { UserRepository } from 'src/repositories/user.repository';
import { UserInfoRepository } from 'src/repositories/user-info.repository';
import { BusinessInfoRepository } from 'src/repositories/business-info.repository';
import { PayPalDeposit } from 'src/entities/paypal-deposit.entity';
import { PayPalDepositRepository } from 'src/repositories/paypal-deposit.repository';
import { PayPalWithdraw } from 'src/entities/paypal-withdraw.entity';
import { PayPalWithdrawRepository } from 'src/repositories/paypal-withdraw.repository';
import { InternalTransfer } from 'src/entities/internal-transfer.entity';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';
import { Transaction } from 'src/entities/transaction.entity';

@Module({
  imports: [
    // Whatever changes here may be applicable to the replica datasource module
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        namingStrategy: new SnakeNamingStrategy(),
        url: process.env.DATABASE_URL,
        entities: [
          User,
          BusinessInfo,
          UserInfo,
          PayPalDeposit,
          PayPalWithdraw,
          InternalTransfer,
          MerchantPayment,
          Transaction,
        ],
        timezone: 'Z',
      }),
    }),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      UserInfoRepository,
      BusinessInfoRepository,
      PayPalDepositRepository,
      PayPalWithdrawRepository,
    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
