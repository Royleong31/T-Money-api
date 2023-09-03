import { Query, Resolver, ResolveField, Parent, Args } from '@nestjs/graphql';

import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { UserInfo } from 'src/entities/user-info.entity';
import { DatabaseService } from 'src/database/database.service';
import { BusinessInfo } from 'src/entities/business-info.entity';
import { Balance } from 'src/objectTypes/balance';
import { TransactionSummaryArgs } from './args/transaction-summary.args';
import { TransactionDetails } from 'src/objectTypes/transaction-details';
import { TransactionSummary } from 'src/objectTypes/transaction-summary';

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

  @Query(() => TransactionDetails)
  @Auth()
  async transactions(
    @RequestUser() user: User,

    @Args({ type: () => TransactionSummaryArgs }) data: TransactionSummaryArgs,
  ): Promise<TransactionDetails> {
    return this.userService.getTransactions(user, data);
  }

  @Query(() => TransactionSummary)
  @Auth()
  async getTransactionSummary(
    @RequestUser() user: User,
    @Args({ type: () => TransactionSummaryArgs }) data: TransactionSummaryArgs,
  ): Promise<TransactionSummary> {
    return this.userService.getTransactionsSummary(user, data);
  }

  @ResolveField()
  async userInfo(@Parent() user: User): Promise<UserInfo> {
    const userInfo = await this.databaseService.userInfoRepository.findOneBy({
      userId: user.id,
    });

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

  @ResolveField()
  async balances(@Parent() user: User): Promise<Balance[]> {
    const balances =
      await this.databaseService.transactionRepository.getUserBalances(user.id);

    return balances;
  }
}
