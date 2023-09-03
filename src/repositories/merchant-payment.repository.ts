import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { MerchantPayment } from 'src/entities/merchant-payment.entity';

@CustomRepository(MerchantPayment)
export class MerchantPaymentRepository extends Repository<MerchantPayment> {}
