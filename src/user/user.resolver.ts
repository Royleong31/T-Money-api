import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserInfo } from 'src/entities/user-info.entity';
import { DatabaseService } from 'src/database/database.service';
import { BusinessInfo } from 'src/entities/business-info.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Auth()
  @Query(() => User)
  me(@RequestUser() user: User): User {
    return user;
  }

  @ResolveField()
  async userInfo(@Parent() user: User): Promise<UserInfo> {
    const userInfo = await this.databaseService.userInfoRepository.findOneBy({
      userId: user.id,
    });

    console.log(userInfo);
    return userInfo;
  }

  @ResolveField()
  async businessInfo(@Parent() user: User): Promise<BusinessInfo> {
    const businessInfo =
      await this.databaseService.businessInfoRepository.findOneBy({
        userId: user.id,
      });

    console.log(businessInfo);
    return businessInfo;
  }
}
