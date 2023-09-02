import { Injectable } from '@nestjs/common';
import { BusinessInfoRepository } from 'src/repositories/business-info.repository';
import { UserInfoRepository } from 'src/repositories/user-info.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    public readonly dataSource: DataSource,
    public readonly userRepository: UserRepository,
    public readonly userInfoRepository: UserInfoRepository,
    public readonly businessInfoRepository: BusinessInfoRepository,
  ) {}
}
