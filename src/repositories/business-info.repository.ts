import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { BusinessInfo } from 'src/entities/business-info.entity';

@CustomRepository(BusinessInfo)
export class BusinessInfoRepository extends Repository<BusinessInfo> {}
