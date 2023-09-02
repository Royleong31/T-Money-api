import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { PayPalDeposit } from 'src/entities/paypal-deposit.entity';

@CustomRepository(PayPalDeposit)
export class PayPalDepositRepository extends Repository<PayPalDeposit> {}
