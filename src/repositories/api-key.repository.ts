import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { ApiKey } from 'src/entities/api-key.entity';

@CustomRepository(ApiKey)
export class ApiKeyRepository extends Repository<ApiKey> {}
