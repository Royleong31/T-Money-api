import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';
import { UserInfo } from 'src/entities/user-info.entity';

@CustomRepository(UserInfo)
export class UserInfoRepository extends Repository<UserInfo> {}
