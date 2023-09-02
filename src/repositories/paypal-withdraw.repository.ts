import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { PayPalWithdraw } from 'src/entities/paypal-withdraw.entity';

@CustomRepository(PayPalWithdraw)
export class PayPalWithdrawRepository extends Repository<PayPalWithdraw> {}
