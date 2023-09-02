import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CustomRepository } from 'src/typeorm/typeorm.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
